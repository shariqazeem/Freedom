//! Kyvern Shield Circuit Breaker Program
//!
//! On-chain smart contract for AI agent protection with automatic
//! circuit breaker functionality on Solana.

use anchor_lang::prelude::*;

declare_id!("CBrkr111111111111111111111111111111111111111");

/// Maximum number of anomalies to track in history
const MAX_ANOMALY_HISTORY: usize = 10;

#[program]
pub mod circuit_breaker {
    use super::*;

    /// Initialize a new Shield configuration for an agent
    pub fn initialize(
        ctx: Context<Initialize>,
        config: ShieldConfig,
    ) -> Result<()> {
        let shield = &mut ctx.accounts.shield;
        let clock = Clock::get()?;

        shield.authority = ctx.accounts.authority.key();
        shield.agent_wallet = ctx.accounts.agent_wallet.key();
        shield.config = config;
        shield.state = CircuitState::Closed;
        shield.anomaly_count = 0;
        shield.last_triggered_at = 0;
        shield.cooldown_ends_at = 0;
        shield.total_transactions = 0;
        shield.blocked_transactions = 0;
        shield.created_at = clock.unix_timestamp;
        shield.bump = ctx.bumps.shield;

        emit!(ShieldInitialized {
            shield: shield.key(),
            agent_wallet: shield.agent_wallet,
            authority: shield.authority,
        });

        Ok(())
    }

    /// Update shield configuration
    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_config: ShieldConfig,
    ) -> Result<()> {
        let shield = &mut ctx.accounts.shield;
        shield.config = new_config;

        emit!(ConfigUpdated {
            shield: shield.key(),
            config: new_config,
        });

        Ok(())
    }

    /// Record a transaction and check against policies
    pub fn record_transaction(
        ctx: Context<RecordTransaction>,
        transaction_data: TransactionRecord,
    ) -> Result<TransactionResult> {
        let shield = &mut ctx.accounts.shield;
        let clock = Clock::get()?;

        // Check if circuit is open (tripped)
        if shield.state == CircuitState::Open {
            if clock.unix_timestamp < shield.cooldown_ends_at {
                shield.blocked_transactions += 1;
                emit!(TransactionBlocked {
                    shield: shield.key(),
                    reason: "Circuit breaker is open".to_string(),
                    signature: transaction_data.signature,
                });
                return Ok(TransactionResult::Blocked);
            } else {
                // Cooldown expired, move to half-open
                shield.state = CircuitState::HalfOpen;
            }
        }

        // Validate transaction against policies
        let validation_result = validate_transaction(shield, &transaction_data)?;

        shield.total_transactions += 1;

        match validation_result {
            ValidationResult::Allowed => {
                // Reset anomaly count on successful transaction in half-open state
                if shield.state == CircuitState::HalfOpen {
                    shield.state = CircuitState::Closed;
                    shield.anomaly_count = 0;
                }
                emit!(TransactionAllowed {
                    shield: shield.key(),
                    signature: transaction_data.signature,
                });
                Ok(TransactionResult::Allowed)
            }
            ValidationResult::Anomaly(reason) => {
                shield.anomaly_count += 1;

                // Check if we should trip the circuit
                if shield.anomaly_count >= shield.config.anomaly_threshold {
                    shield.state = CircuitState::Open;
                    shield.last_triggered_at = clock.unix_timestamp;
                    shield.cooldown_ends_at = clock.unix_timestamp + shield.config.cooldown_seconds;

                    emit!(CircuitBreakerTriggered {
                        shield: shield.key(),
                        anomaly_count: shield.anomaly_count,
                        cooldown_ends_at: shield.cooldown_ends_at,
                    });
                }

                emit!(AnomalyDetected {
                    shield: shield.key(),
                    reason: reason.clone(),
                    anomaly_count: shield.anomaly_count,
                    signature: transaction_data.signature,
                });

                Ok(TransactionResult::Flagged)
            }
            ValidationResult::Blocked(reason) => {
                shield.blocked_transactions += 1;
                emit!(TransactionBlocked {
                    shield: shield.key(),
                    reason,
                    signature: transaction_data.signature,
                });
                Ok(TransactionResult::Blocked)
            }
        }
    }

    /// Manually trigger the circuit breaker
    pub fn trigger_circuit_breaker(
        ctx: Context<TriggerCircuitBreaker>,
        reason: String,
    ) -> Result<()> {
        let shield = &mut ctx.accounts.shield;
        let clock = Clock::get()?;

        shield.state = CircuitState::Open;
        shield.last_triggered_at = clock.unix_timestamp;
        shield.cooldown_ends_at = clock.unix_timestamp + shield.config.cooldown_seconds;

        emit!(CircuitBreakerTriggered {
            shield: shield.key(),
            anomaly_count: shield.anomaly_count,
            cooldown_ends_at: shield.cooldown_ends_at,
        });

        emit!(ManualTrigger {
            shield: shield.key(),
            triggered_by: ctx.accounts.authority.key(),
            reason,
        });

        Ok(())
    }

    /// Reset the circuit breaker
    pub fn reset_circuit_breaker(ctx: Context<ResetCircuitBreaker>) -> Result<()> {
        let shield = &mut ctx.accounts.shield;

        shield.state = CircuitState::Closed;
        shield.anomaly_count = 0;
        shield.cooldown_ends_at = 0;

        emit!(CircuitBreakerReset {
            shield: shield.key(),
            reset_by: ctx.accounts.authority.key(),
        });

        Ok(())
    }

    /// Close the shield account and recover rent
    pub fn close_shield(_ctx: Context<CloseShield>) -> Result<()> {
        // Account will be closed automatically by Anchor
        Ok(())
    }
}

// =============================================================================
// Validation Logic
// =============================================================================

fn validate_transaction(
    shield: &Shield,
    tx: &TransactionRecord,
) -> Result<ValidationResult> {
    let config = &shield.config;

    // Check if program is blocked
    if config.blocked_programs.contains(&tx.program_id) {
        return Ok(ValidationResult::Blocked(
            "Program is in blocklist".to_string(),
        ));
    }

    // Check if program is in allowlist (if allowlist is non-empty)
    if !config.allowed_programs.is_empty()
        && !config.allowed_programs.contains(&tx.program_id)
    {
        return Ok(ValidationResult::Anomaly(
            "Program not in allowlist".to_string(),
        ));
    }

    // Check transaction value against max limit
    if tx.value > config.max_transaction_value {
        return Ok(ValidationResult::Anomaly(format!(
            "Transaction value {} exceeds max {}",
            tx.value, config.max_transaction_value
        )));
    }

    // Check against approval threshold
    if tx.value > config.approval_threshold {
        return Ok(ValidationResult::Anomaly(format!(
            "Transaction value {} requires approval (threshold: {})",
            tx.value, config.approval_threshold
        )));
    }

    Ok(ValidationResult::Allowed)
}

// =============================================================================
// Account Structures
// =============================================================================

#[account]
#[derive(Default)]
pub struct Shield {
    /// Authority that can manage this shield
    pub authority: Pubkey,
    /// The agent wallet being protected
    pub agent_wallet: Pubkey,
    /// Shield configuration
    pub config: ShieldConfig,
    /// Current circuit state
    pub state: CircuitState,
    /// Number of anomalies in current window
    pub anomaly_count: u8,
    /// Unix timestamp when circuit was last triggered
    pub last_triggered_at: i64,
    /// Unix timestamp when cooldown ends
    pub cooldown_ends_at: i64,
    /// Total transactions processed
    pub total_transactions: u64,
    /// Total transactions blocked
    pub blocked_transactions: u64,
    /// Account creation timestamp
    pub created_at: i64,
    /// PDA bump seed
    pub bump: u8,
}

impl Shield {
    pub const LEN: usize = 8  // discriminator
        + 32  // authority
        + 32  // agent_wallet
        + ShieldConfig::LEN  // config
        + 1   // state
        + 1   // anomaly_count
        + 8   // last_triggered_at
        + 8   // cooldown_ends_at
        + 8   // total_transactions
        + 8   // blocked_transactions
        + 8   // created_at
        + 1;  // bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct ShieldConfig {
    /// Maximum transaction value allowed (in lamports)
    pub max_transaction_value: u64,
    /// Daily spending limit (in lamports)
    pub daily_spend_limit: u64,
    /// Value above which approval is required
    pub approval_threshold: u64,
    /// Number of anomalies before triggering circuit breaker
    pub anomaly_threshold: u8,
    /// Time window for anomaly detection (seconds)
    pub time_window_seconds: i64,
    /// Cooldown period after trigger (seconds)
    pub cooldown_seconds: i64,
    /// Allowed program IDs (empty = all allowed)
    pub allowed_programs: Vec<Pubkey>,
    /// Blocked program IDs
    pub blocked_programs: Vec<Pubkey>,
}

impl ShieldConfig {
    pub const LEN: usize = 8  // max_transaction_value
        + 8   // daily_spend_limit
        + 8   // approval_threshold
        + 1   // anomaly_threshold
        + 8   // time_window_seconds
        + 8   // cooldown_seconds
        + 4 + (32 * 10)  // allowed_programs (vec with max 10)
        + 4 + (32 * 10); // blocked_programs (vec with max 10)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Default)]
pub enum CircuitState {
    #[default]
    Closed,
    Open,
    HalfOpen,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TransactionRecord {
    /// Transaction signature
    pub signature: [u8; 64],
    /// Target program ID
    pub program_id: Pubkey,
    /// Transaction value in lamports
    pub value: u64,
    /// Transaction type identifier
    pub tx_type: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TransactionResult {
    Allowed,
    Flagged,
    Blocked,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ValidationResult {
    Allowed,
    Anomaly(String),
    Blocked(String),
}

// =============================================================================
// Instruction Contexts
// =============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = Shield::LEN,
        seeds = [b"shield", agent_wallet.key().as_ref()],
        bump
    )]
    pub shield: Account<'info, Shield>,

    /// CHECK: This is the agent wallet to be protected
    pub agent_wallet: UncheckedAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        mut,
        seeds = [b"shield", shield.agent_wallet.as_ref()],
        bump = shield.bump,
        has_one = authority
    )]
    pub shield: Account<'info, Shield>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct RecordTransaction<'info> {
    #[account(
        mut,
        seeds = [b"shield", shield.agent_wallet.as_ref()],
        bump = shield.bump
    )]
    pub shield: Account<'info, Shield>,

    /// The agent or authority recording the transaction
    pub recorder: Signer<'info>,
}

#[derive(Accounts)]
pub struct TriggerCircuitBreaker<'info> {
    #[account(
        mut,
        seeds = [b"shield", shield.agent_wallet.as_ref()],
        bump = shield.bump,
        has_one = authority
    )]
    pub shield: Account<'info, Shield>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResetCircuitBreaker<'info> {
    #[account(
        mut,
        seeds = [b"shield", shield.agent_wallet.as_ref()],
        bump = shield.bump,
        has_one = authority
    )]
    pub shield: Account<'info, Shield>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseShield<'info> {
    #[account(
        mut,
        seeds = [b"shield", shield.agent_wallet.as_ref()],
        bump = shield.bump,
        has_one = authority,
        close = authority
    )]
    pub shield: Account<'info, Shield>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

// =============================================================================
// Events
// =============================================================================

#[event]
pub struct ShieldInitialized {
    pub shield: Pubkey,
    pub agent_wallet: Pubkey,
    pub authority: Pubkey,
}

#[event]
pub struct ConfigUpdated {
    pub shield: Pubkey,
    pub config: ShieldConfig,
}

#[event]
pub struct TransactionAllowed {
    pub shield: Pubkey,
    pub signature: [u8; 64],
}

#[event]
pub struct TransactionBlocked {
    pub shield: Pubkey,
    pub reason: String,
    pub signature: [u8; 64],
}

#[event]
pub struct AnomalyDetected {
    pub shield: Pubkey,
    pub reason: String,
    pub anomaly_count: u8,
    pub signature: [u8; 64],
}

#[event]
pub struct CircuitBreakerTriggered {
    pub shield: Pubkey,
    pub anomaly_count: u8,
    pub cooldown_ends_at: i64,
}

#[event]
pub struct CircuitBreakerReset {
    pub shield: Pubkey,
    pub reset_by: Pubkey,
}

#[event]
pub struct ManualTrigger {
    pub shield: Pubkey,
    pub triggered_by: Pubkey,
    pub reason: String,
}
