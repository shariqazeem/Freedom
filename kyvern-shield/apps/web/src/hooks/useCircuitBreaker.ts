/**
 * Circuit Breaker React Hook
 *
 * Manages circuit breaker state and provides simulation functionality
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  createConnection,
  getShieldPDA,
  fetchShieldData,
  subscribeToEvents,
  unsubscribeFromEvents,
  type ShieldData,
  type CircuitState,
  type CircuitBreakerEvent,
} from "@/lib/solana/circuit-breaker";
import { PublicKey, Connection } from "@solana/web3.js";

// Demo agent wallet for simulation (you can change this)
const DEMO_AGENT_WALLET = "DemoAgent111111111111111111111111111111111";

interface UseCircuitBreakerOptions {
  agentWallet?: string;
  enableRealtime?: boolean;
  pollingInterval?: number;
}

interface UseCircuitBreakerReturn {
  // State
  circuitState: CircuitState;
  shieldData: ShieldData | null;
  isLoading: boolean;
  error: string | null;
  events: CircuitBreakerEvent[];
  isSimulating: boolean;

  // Actions
  simulateAttack: (amount?: number) => Promise<void>;
  resetCircuit: () => Promise<void>;
  refreshState: () => Promise<void>;
}

export function useCircuitBreaker(
  options: UseCircuitBreakerOptions = {}
): UseCircuitBreakerReturn {
  const {
    agentWallet = DEMO_AGENT_WALLET,
    enableRealtime = true,
    pollingInterval = 3000,
  } = options;

  // State
  const [circuitState, setCircuitState] = useState<CircuitState>("closed");
  const [shieldData, setShieldData] = useState<ShieldData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<CircuitBreakerEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Refs
  const connectionRef = useRef<Connection | null>(null);
  const subscriptionRef = useRef<number | null>(null);
  const inDemoModeRef = useRef(false); // Prevents polling from overwriting simulated state

  // Initialize connection
  useEffect(() => {
    connectionRef.current = createConnection();
    return () => {
      if (subscriptionRef.current !== null && connectionRef.current) {
        unsubscribeFromEvents(connectionRef.current, subscriptionRef.current);
      }
    };
  }, []);

  // Fetch shield data
  const refreshState = useCallback(async () => {
    // Don't overwrite simulated demo state
    if (inDemoModeRef.current) return;
    if (!connectionRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Try to get shield PDA
      let agentPubkey: PublicKey;
      try {
        agentPubkey = new PublicKey(agentWallet);
      } catch {
        // If invalid pubkey, use a demo state
        setCircuitState("closed");
        setShieldData(null);
        setIsLoading(false);
        return;
      }

      const [shieldPDA] = getShieldPDA(agentPubkey);
      const data = await fetchShieldData(connectionRef.current, shieldPDA);

      if (data) {
        setShieldData(data);
        setCircuitState(data.state);
      } else {
        // No shield account exists - show demo state
        setCircuitState("closed");
        setShieldData(null);
      }
    } catch (err) {
      console.error("Error refreshing state:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch state");
    } finally {
      setIsLoading(false);
    }
  }, [agentWallet]);

  // Poll for updates
  useEffect(() => {
    refreshState();

    const interval = setInterval(refreshState, pollingInterval);
    return () => clearInterval(interval);
  }, [refreshState, pollingInterval]);

  // Subscribe to real-time events
  useEffect(() => {
    if (!enableRealtime || !connectionRef.current) return;

    const handleEvent = (event: CircuitBreakerEvent) => {
      setEvents((prev) => [event, ...prev].slice(0, 50)); // Keep last 50 events

      // Update state based on event
      if (event.type === "triggered") {
        setCircuitState("open");
      } else if (event.type === "reset") {
        setCircuitState("closed");
      }

      // Refresh full state
      refreshState();
    };

    subscriptionRef.current = subscribeToEvents(
      connectionRef.current,
      handleEvent
    );

    return () => {
      if (subscriptionRef.current !== null && connectionRef.current) {
        unsubscribeFromEvents(connectionRef.current, subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [enableRealtime, refreshState]);

  // Simulate attack via API
  const simulateAttack = useCallback(async (amount: number = 1000) => {
    setIsSimulating(true);
    setError(null);

    try {
      const response = await fetch("/api/circuit-breaker/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "attack",
          amount: amount * 1_000_000_000, // Convert SOL to lamports
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Simulation failed");
      }

      // Update local state immediately for responsiveness
      if (result.circuitTriggered) {
        inDemoModeRef.current = true; // Prevent polling from overwriting
        setCircuitState("open");
        setEvents((prev) => [
          {
            type: "triggered",
            shield: result.shield || "demo",
            timestamp: Date.now(),
            data: { amount, reason: result.reason },
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Simulation error:", err);
      setError(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setIsSimulating(false);
    }
  }, [refreshState]);

  // Reset circuit via API
  const resetCircuit = useCallback(async () => {
    setIsSimulating(true);
    setError(null);

    try {
      const response = await fetch("/api/circuit-breaker/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Reset failed");
      }

      // Update local state
      inDemoModeRef.current = false; // Allow polling again
      setCircuitState("closed");
      setEvents((prev) => [
        {
          type: "reset",
          shield: result.shield || "demo",
          timestamp: Date.now(),
          data: {},
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Reset error:", err);
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setIsSimulating(false);
    }
  }, [refreshState]);

  return {
    circuitState,
    shieldData,
    isLoading,
    error,
    events,
    isSimulating,
    simulateAttack,
    resetCircuit,
    refreshState,
  };
}
