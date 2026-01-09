/**
 * Circuit Breaker Solana Program Client
 *
 * Connects the dashboard to the on-chain Circuit Breaker program
 */

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";

// Program ID deployed on devnet
export const CIRCUIT_BREAKER_PROGRAM_ID = new PublicKey(
  "6sqKVnqGaXxxBejFWRrAWv62wAaGUDedDYvm1mx1yH7J"
);

// RPC endpoints
export const SOLANA_RPC_URL = "https://api.devnet.solana.com";
export const SOLANA_WS_URL = "wss://api.devnet.solana.com";

// Circuit states matching the on-chain enum
export type CircuitState = "closed" | "open" | "half_open";

// Shield account data structure
export interface ShieldData {
  authority: PublicKey;
  agentWallet: PublicKey;
  state: CircuitState;
  anomalyCount: number;
  lastTriggeredAt: number;
  cooldownEndsAt: number;
  totalTransactions: number;
  blockedTransactions: number;
  createdAt: number;
  config: {
    maxTransactionValue: number;
    dailySpendLimit: number;
    approvalThreshold: number;
    anomalyThreshold: number;
    cooldownSeconds: number;
  };
}

// Event types
export interface CircuitBreakerEvent {
  type: "triggered" | "reset" | "transaction_blocked" | "anomaly_detected";
  shield: string;
  timestamp: number;
  data: Record<string, unknown>;
}

/**
 * Get the Shield PDA for an agent wallet
 */
export function getShieldPDA(agentWallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("shield"), agentWallet.toBuffer()],
    CIRCUIT_BREAKER_PROGRAM_ID
  );
}

/**
 * Create Solana connection
 */
export function createConnection(): Connection {
  return new Connection(SOLANA_RPC_URL, {
    commitment: "confirmed",
    wsEndpoint: SOLANA_WS_URL,
  });
}

/**
 * Parse circuit state from on-chain data
 */
function parseCircuitState(value: number): CircuitState {
  switch (value) {
    case 0:
      return "closed";
    case 1:
      return "open";
    case 2:
      return "half_open";
    default:
      return "closed";
  }
}

/**
 * Fetch Shield account data from chain
 */
export async function fetchShieldData(
  connection: Connection,
  shieldPDA: PublicKey
): Promise<ShieldData | null> {
  try {
    const accountInfo = await connection.getAccountInfo(shieldPDA);
    if (!accountInfo) return null;

    // Parse the account data (Anchor format)
    // Skip 8-byte discriminator
    const data = accountInfo.data.slice(8);

    // Parse fields according to Shield struct
    const authority = new PublicKey(data.slice(0, 32));
    const agentWallet = new PublicKey(data.slice(32, 64));

    // Config starts at offset 64
    const maxTransactionValue = Number(data.readBigUInt64LE(64));
    const dailySpendLimit = Number(data.readBigUInt64LE(72));
    const approvalThreshold = Number(data.readBigUInt64LE(80));
    const anomalyThreshold = data[88];
    const timeWindowSeconds = Number(data.readBigInt64LE(89));
    const cooldownSeconds = Number(data.readBigInt64LE(97));

    // After config (skip allowed/blocked program vecs for now)
    // State and counters are after the config struct
    const stateOffset = 105 + (4 + 32 * 10) + (4 + 32 * 10); // After vecs
    const state = parseCircuitState(data[stateOffset]);
    const anomalyCount = data[stateOffset + 1];
    const lastTriggeredAt = Number(data.readBigInt64LE(stateOffset + 2));
    const cooldownEndsAt = Number(data.readBigInt64LE(stateOffset + 10));
    const totalTransactions = Number(data.readBigUInt64LE(stateOffset + 18));
    const blockedTransactions = Number(data.readBigUInt64LE(stateOffset + 26));
    const createdAt = Number(data.readBigInt64LE(stateOffset + 34));

    return {
      authority,
      agentWallet,
      state,
      anomalyCount,
      lastTriggeredAt,
      cooldownEndsAt,
      totalTransactions,
      blockedTransactions,
      createdAt,
      config: {
        maxTransactionValue,
        dailySpendLimit,
        approvalThreshold,
        anomalyThreshold,
        cooldownSeconds,
      },
    };
  } catch (error) {
    console.error("Error fetching shield data:", error);
    return null;
  }
}

/**
 * Subscribe to program logs for real-time events
 */
export function subscribeToEvents(
  connection: Connection,
  onEvent: (event: CircuitBreakerEvent) => void
): number {
  return connection.onLogs(
    CIRCUIT_BREAKER_PROGRAM_ID,
    (logs) => {
      const timestamp = Date.now();

      // Parse event from logs
      for (const log of logs.logs) {
        if (log.includes("CircuitBreakerTriggered")) {
          onEvent({
            type: "triggered",
            shield: logs.signature,
            timestamp,
            data: { signature: logs.signature },
          });
        } else if (log.includes("CircuitBreakerReset")) {
          onEvent({
            type: "reset",
            shield: logs.signature,
            timestamp,
            data: { signature: logs.signature },
          });
        } else if (log.includes("TransactionBlocked")) {
          onEvent({
            type: "transaction_blocked",
            shield: logs.signature,
            timestamp,
            data: { signature: logs.signature },
          });
        } else if (log.includes("AnomalyDetected")) {
          onEvent({
            type: "anomaly_detected",
            shield: logs.signature,
            timestamp,
            data: { signature: logs.signature },
          });
        }
      }
    },
    "confirmed"
  );
}

/**
 * Unsubscribe from events
 */
export function unsubscribeFromEvents(
  connection: Connection,
  subscriptionId: number
): void {
  connection.removeOnLogsListener(subscriptionId);
}
