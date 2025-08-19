import { PathwaveResponse } from "./types";

/**
 * Pathwave.io client for invoking tools via their API
 */
export class PathwaveClient {
  private readonly baseUrl = "https://api.pathwave.io";
  private readonly userSid: string;

  /**
   * Namespaced helpers for PayPal-related tools
   */
  public readonly paypal: {
    /**
     * Make a payout via PayPal
     * @param email - Payee's email address
     * @param amount - Amount to pay
     * @param currency - 3-letter currency code (default: CHF)
     */
    makePayment: (email: string, amount: number, currency?: string) => Promise<PathwaveResponse>;
  };

  /**
   * Creates a new PathwaveClient instance
   * @throws Error if PATHWAVE_USER_SID environment variable is not set
   */
  constructor() {
    const userSid = process.env.PATHWAVE_USER_SID;

    if (!userSid || userSid.trim() === "") {
      throw new Error(
        "PATHWAVE_USER_SID environment variable is required but was not provided. " +
          "Please set it before initializing the PathwaveClient."
      );
    }

    this.userSid = userSid;

    // Initialize namespaces
    this.paypal = {
      makePayment: async (email: string, amount: number, currency = "CHF") => {
        return this.invokeTool("paypal.payout", { email, amount, currency });
      },
    };
  }

  /**
   * Invokes a tool with the specified arguments
   * @param tool - The tool name to invoke
   * @param args - Arguments to pass to the tool
   * @returns A promise resolving to the tool response
   */
  async invokeTool(tool: string, args: Record<string, any>): Promise<PathwaveResponse> {
    try {
      const url = `${this.baseUrl}/users/${this.userSid}/tools/${tool}/invoke`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ args }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          ok: false,
          error: `HTTP error ${response.status}: ${errorText}`,
        };
      }

      const data = await response.json();
      return {
        ok: true,
        data,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
