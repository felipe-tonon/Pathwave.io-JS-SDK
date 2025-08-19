/**
 * Represents a tool call with name and arguments
 */
export type ToolCall = {
  name: string;
  args: Record<string, any>;
};

/**
 * Represents the context for an agent
 */
export type AgentContext = {
  agentId: string;
  sessionId: string;
};

/**
 * Represents the response from a Pathwave API call
 */
export type PathwaveResponse = {
  ok: boolean;
  data?: any;
  error?: string;
};