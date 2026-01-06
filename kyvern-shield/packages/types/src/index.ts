/**
 * Kyvern Shield - Core Type Definitions
 * Security infrastructure for Web3 AI agents
 */

// =============================================================================
// Agent Types
// =============================================================================

export interface Agent {
  /** Unique identifier for the agent */
  id: string;
  /** Human-readable name */
  name: string;
  /** Agent's wallet public key */
  walletAddress: string;
  /** Current operational status */
  status: AgentStatus;
  /** Security configuration */
  config: AgentConfig;
  /** Timestamp of registration */
  createdAt: Date;
  /** Last activity timestamp */
  lastActiveAt: Date;
}

export type AgentStatus = "active" | "paused" | "suspended" | "terminated";

export interface AgentConfig {
  /** Maximum transaction value in lamports */
  maxTransactionValue: bigint;
  /** Daily spending limit in lamports */
  dailySpendLimit: bigint;
  /** Allowed program IDs the agent can interact with */
  allowedPrograms: string[];
  /** Blocked program IDs */
  blockedPrograms: string[];
  /** Require human approval above this threshold */
  approvalThreshold: bigint;
  /** Circuit breaker configuration */
  circuitBreaker: CircuitBreakerConfig;
}

// =============================================================================
// Circuit Breaker Types
// =============================================================================

export interface CircuitBreakerConfig {
  /** Enable automatic circuit breaker */
  enabled: boolean;
  /** Number of anomalies before triggering */
  anomalyThreshold: number;
  /** Time window for anomaly detection (seconds) */
  timeWindowSeconds: number;
  /** Cooldown period after trigger (seconds) */
  cooldownSeconds: number;
  /** Actions to take when triggered */
  actions: CircuitBreakerAction[];
}

export type CircuitBreakerAction =
  | "pause_agent"
  | "block_transactions"
  | "notify_owner"
  | "require_approval"
  | "terminate_agent";

export interface CircuitBreakerState {
  /** Current circuit state */
  state: "closed" | "open" | "half_open";
  /** Number of anomalies in current window */
  anomalyCount: number;
  /** Timestamp of last trigger */
  lastTriggeredAt: Date | null;
  /** Timestamp when cooldown ends */
  cooldownEndsAt: Date | null;
}

// =============================================================================
// Transaction Types
// =============================================================================

export interface AgentTransaction {
  /** Transaction signature */
  signature: string;
  /** Agent that initiated the transaction */
  agentId: string;
  /** Target program ID */
  programId: string;
  /** Transaction type classification */
  type: TransactionType;
  /** Value transferred (if applicable) */
  value: bigint;
  /** Risk assessment */
  risk: RiskAssessment;
  /** Timestamp */
  timestamp: Date;
  /** Raw transaction data */
  rawData: string;
}

export type TransactionType =
  | "transfer"
  | "swap"
  | "stake"
  | "unstake"
  | "mint"
  | "burn"
  | "contract_call"
  | "unknown";

// =============================================================================
// Risk Assessment Types
// =============================================================================

export interface RiskAssessment {
  /** Overall risk score (0-100) */
  score: number;
  /** Risk level classification */
  level: RiskLevel;
  /** Individual risk factors */
  factors: RiskFactor[];
  /** Recommended action */
  recommendation: RiskRecommendation;
  /** AI model confidence (0-1) */
  confidence: number;
}

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface RiskFactor {
  /** Factor identifier */
  id: string;
  /** Human-readable description */
  description: string;
  /** Factor weight in overall score */
  weight: number;
  /** Individual factor score */
  score: number;
}

export type RiskRecommendation =
  | "allow"
  | "monitor"
  | "delay"
  | "require_approval"
  | "block";

// =============================================================================
// Alert Types
// =============================================================================

export interface Alert {
  /** Unique alert identifier */
  id: string;
  /** Agent that triggered the alert */
  agentId: string;
  /** Alert severity */
  severity: AlertSeverity;
  /** Alert type */
  type: AlertType;
  /** Human-readable message */
  message: string;
  /** Related transaction (if applicable) */
  transactionSignature: string | null;
  /** Alert metadata */
  metadata: Record<string, unknown>;
  /** Timestamp */
  createdAt: Date;
  /** Whether alert has been acknowledged */
  acknowledged: boolean;
  /** Resolution status */
  resolution: AlertResolution | null;
}

export type AlertSeverity = "info" | "warning" | "error" | "critical";

export type AlertType =
  | "anomaly_detected"
  | "threshold_exceeded"
  | "circuit_breaker_triggered"
  | "unauthorized_program"
  | "suspicious_pattern"
  | "rate_limit_exceeded"
  | "agent_compromised";

export interface AlertResolution {
  /** Resolution action taken */
  action: string;
  /** User who resolved */
  resolvedBy: string;
  /** Resolution timestamp */
  resolvedAt: Date;
  /** Notes */
  notes: string;
}

// =============================================================================
// Policy Types
// =============================================================================

export interface SecurityPolicy {
  /** Policy identifier */
  id: string;
  /** Policy name */
  name: string;
  /** Policy rules */
  rules: PolicyRule[];
  /** Whether policy is active */
  active: boolean;
  /** Priority (lower = higher priority) */
  priority: number;
}

export interface PolicyRule {
  /** Rule identifier */
  id: string;
  /** Condition to match */
  condition: PolicyCondition;
  /** Action to take when matched */
  action: PolicyAction;
}

export interface PolicyCondition {
  /** Field to evaluate */
  field: string;
  /** Comparison operator */
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "regex";
  /** Value to compare against */
  value: string | number | boolean;
}

export interface PolicyAction {
  /** Action type */
  type: "allow" | "block" | "alert" | "require_approval" | "rate_limit";
  /** Action parameters */
  params?: Record<string, unknown>;
}

// =============================================================================
// API Types
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  requestId: string;
  timestamp: Date;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// =============================================================================
// Event Types (for real-time streaming)
// =============================================================================

export type ShieldEvent =
  | { type: "agent_registered"; payload: Agent }
  | { type: "agent_status_changed"; payload: { agentId: string; status: AgentStatus } }
  | { type: "transaction_detected"; payload: AgentTransaction }
  | { type: "alert_created"; payload: Alert }
  | { type: "circuit_breaker_triggered"; payload: { agentId: string; state: CircuitBreakerState } }
  | { type: "policy_violated"; payload: { agentId: string; policyId: string; rule: PolicyRule } };
