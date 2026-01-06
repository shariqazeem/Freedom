/**
 * Kyvern Shield API Client
 *
 * Connects the dashboard to the Python FastAPI backend
 * for real-time transaction analysis and monitoring.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// =============================================================================
// TYPES - Mirror the Python Pydantic models
// =============================================================================

export type AnalysisDecision = "allow" | "block";

export interface TransactionIntent {
  agent_id: string;
  target_address: string;
  amount_sol: number;
  function_signature?: string;
  reasoning: string;
  // Optional fields for untrusted source detection
  data_sources?: DataSource[];
}

export interface DataSource {
  type: "http" | "ipfs" | "internal" | "user_input";
  url?: string;
  trusted: boolean;
  content_hash?: string;
}

export interface HeuristicResult {
  passed: boolean;
  blacklisted: boolean;
  amount_exceeded: boolean;
  details: string[];
}

export interface LLMAnalysisResult {
  risk_score: number;
  consistency_check: boolean;
  prompt_injection_detected: boolean;
  explanation: string;
  raw_response?: string;
}

export type SourceDetectionFlag =
  | "UNTRUSTED_SOURCE"
  | "SANDBOX_TRIGGER"
  | "BLOCKED_DOMAIN"
  | "INDIRECT_INJECTION"
  | "MANIPULATION_PATTERN"
  | "IGNORE_INSTRUCTIONS"
  | "URGENCY_MANIPULATION";

export interface SourceDetectionResult {
  risk_score: number;
  flags: SourceDetectionFlag[];
  urls_found: string[];
  untrusted_domains: string[];
  sandbox_mode: boolean;
  details: string[];
}

export interface AnalysisResult {
  request_id: string;
  decision: AnalysisDecision;
  risk_score: number;
  explanation: string;
  heuristic_result: HeuristicResult;
  source_detection_result?: SourceDetectionResult;
  llm_result?: LLMAnalysisResult;
  analysis_time_ms: number;
  timestamp: string;
  // Legacy: Sandbox warnings from research-based detection
  sandbox_warnings?: SandboxWarning[];
}

export interface SandboxWarning {
  type: "untrusted_source" | "indirect_injection" | "data_exfiltration";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  source?: string;
}

export interface BlacklistEntry {
  id: number;
  type: "address" | "program" | "pattern";
  value: string;
  reason: string;
  source: string;
  severity: string;
  created_at: string;
  active: boolean;
}

export interface RogueAgentScenario {
  scenario: "blacklisted_address" | "excessive_amount" | "prompt_injection" | "indirect_injection" | "custom";
  custom_reasoning?: string;
}

// =============================================================================
// API CLIENT CLASS
// =============================================================================

class ShieldAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error (${response.status}): ${error}`);
    }

    return response.json();
  }

  // ===========================================================================
  // ANALYSIS ENDPOINTS
  // ===========================================================================

  /**
   * Analyze a transaction intent for security risks.
   * This is the main endpoint AI agents call before executing transactions.
   */
  async analyzeIntent(intent: TransactionIntent): Promise<AnalysisResult> {
    return this.request<AnalysisResult>("/api/v1/analysis/intent", {
      method: "POST",
      body: JSON.stringify(intent),
    });
  }

  /**
   * Simulate a rogue agent attack for testing.
   */
  async simulateRogueAgent(scenario: RogueAgentScenario): Promise<AnalysisResult> {
    return this.request<AnalysisResult>("/api/v1/analysis/simulate/rogue", {
      method: "POST",
      body: JSON.stringify(scenario),
    });
  }

  /**
   * Get recent transaction analysis results for the dashboard feed.
   * This is polled to show real-time activity.
   */
  async getRecentTransactions(limit: number = 50): Promise<AnalysisResult[]> {
    return this.request<AnalysisResult[]>(`/api/v1/analysis/recent?limit=${limit}`);
  }

  // ===========================================================================
  // BLACKLIST ENDPOINTS
  // ===========================================================================

  /**
   * Get all blacklist entries.
   */
  async getBlacklist(): Promise<{ entries: BlacklistEntry[]; total: number }> {
    return this.request("/api/v1/analysis/blacklist");
  }

  /**
   * Check if an address is blacklisted.
   */
  async checkBlacklist(address: string): Promise<{
    address: string;
    blacklisted: boolean;
    reason?: string;
    severity?: string;
  }> {
    return this.request(`/api/v1/analysis/blacklist/check/${address}`);
  }

  /**
   * Add an address to the blacklist.
   */
  async addToBlacklist(entry: {
    type: "address" | "program";
    value: string;
    reason: string;
    severity?: string;
  }): Promise<BlacklistEntry> {
    return this.request("/api/v1/analysis/blacklist", {
      method: "POST",
      body: JSON.stringify(entry),
    });
  }

  // ===========================================================================
  // HEALTH & STATUS
  // ===========================================================================

  /**
   * Check API health status.
   */
  async getHealth(): Promise<{ status: string; version: string }> {
    return this.request("/");
  }

  /**
   * Get system metrics.
   */
  async getMetrics(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/metrics`);
    return response.text();
  }
}

// Singleton instance
export const shieldAPI = new ShieldAPIClient();

// =============================================================================
// REACT HOOKS FOR DASHBOARD
// =============================================================================

import { useState, useEffect, useCallback } from "react";

/**
 * Hook for real-time transaction analysis.
 */
export function useTransactionAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (intent: TransactionIntent) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await shieldAPI.analyzeIntent(intent);
      setLastResult(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { analyze, isAnalyzing, lastResult, error };
}

/**
 * Hook for blacklist management.
 */
export function useBlacklist() {
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await shieldAPI.getBlacklist();
      setEntries(data.entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blacklist");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entries, isLoading, error, refresh };
}

/**
 * Hook for API health monitoring.
 */
export function useAPIHealth() {
  const [isConnected, setIsConnected] = useState(false);
  const [apiVersion, setApiVersion] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await shieldAPI.getHealth();
        setIsConnected(true);
        setApiVersion(health.version);
      } catch {
        setIsConnected(false);
        setApiVersion(null);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  return { isConnected, apiVersion };
}

/**
 * Hook for rogue agent simulation (testing).
 */
export function useRogueSimulation() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const simulate = useCallback(async (scenario: RogueAgentScenario) => {
    setIsSimulating(true);
    setError(null);

    try {
      const result = await shieldAPI.simulateRogueAgent(scenario);
      setResults((prev) => [result, ...prev].slice(0, 50)); // Keep last 50
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Simulation failed";
      setError(message);
      throw err;
    } finally {
      setIsSimulating(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return { simulate, isSimulating, results, error, clearResults };
}

/**
 * Hook for transaction feed with polling.
 */
export function useTransactionFeed(pollingInterval = 5000) {
  const [transactions, setTransactions] = useState<AnalysisResult[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addTransaction = useCallback((result: AnalysisResult) => {
    setTransactions((prev) => [result, ...prev].slice(0, 100)); // Keep last 100
  }, []);

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await shieldAPI.getHealth();
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval]);

  return { transactions, addTransaction, isConnected };
}
