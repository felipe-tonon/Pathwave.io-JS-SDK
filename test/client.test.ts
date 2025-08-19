import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PathwaveClient } from "../src/client";

describe("PathwaveClient", () => {
  // Store original environment variable
  const originalEnv = process.env.PATHWAVE_USER_SID;

  beforeEach(() => {
    // Mock global fetch
    global.fetch = vi.fn();
    // Reset environment variable
    process.env.PATHWAVE_USER_SID = "test-user-sid";
  });

  afterEach(() => {
    // Restore original environment variable
    process.env.PATHWAVE_USER_SID = originalEnv;
    // Clear mocks
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("throws an error if PATHWAVE_USER_SID is not set", () => {
      // Unset the environment variable
      delete process.env.PATHWAVE_USER_SID;

      // Should throw when trying to instantiate the client
      expect(() => new PathwaveClient()).toThrow(/PATHWAVE_USER_SID.*required/);
    });

    it("throws an error if PATHWAVE_USER_SID is empty", () => {
      // Set the environment variable to empty string
      process.env.PATHWAVE_USER_SID = "  ";

      // Should throw when trying to instantiate the client
      expect(() => new PathwaveClient()).toThrow(/PATHWAVE_USER_SID.*required/);
    });

    it("creates a client instance when PATHWAVE_USER_SID is set", () => {
      // Should not throw when environment variable is set
      expect(() => new PathwaveClient()).not.toThrow();
    });
  });

  describe("invokeTool", () => {
    it("sends a POST request to the correct URL with proper body", async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ result: "success" }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      // Create client and invoke tool
      const client = new PathwaveClient();
      const toolName = "test-tool";
      const args = { param1: "value1", param2: 42 };
      await client.invokeTool(toolName, args);

      // Verify the fetch call
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.pathwave.io/users/test-user-sid/tools/test-tool/invoke",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ args }),
        }
      );
    });

    it("returns ok:true with data on successful response", async () => {
      // Mock successful response
      const mockResponseData = { result: "success" };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponseData),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      // Create client and invoke tool
      const client = new PathwaveClient();
      const response = await client.invokeTool("test-tool", {});

      // Verify the response
      expect(response).toEqual({
        ok: true,
        data: mockResponseData,
      });
    });

    it("returns ok:false with error message on HTTP error", async () => {
      // Mock HTTP error response
      const mockResponse = {
        ok: false,
        status: 404,
        text: vi.fn().mockResolvedValue("Not Found"),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      // Create client and invoke tool
      const client = new PathwaveClient();
      const response = await client.invokeTool("test-tool", {});

      // Verify the response
      expect(response).toEqual({
        ok: false,
        error: "HTTP error 404: Not Found",
      });
    });

    it("returns ok:false with error message on fetch failure", async () => {
      // Mock fetch throwing an error
      const errorMessage = "Network error";
      (global.fetch as any).mockRejectedValue(new Error(errorMessage));

      // Create client and invoke tool
      const client = new PathwaveClient();
      const response = await client.invokeTool("test-tool", {});

      // Verify the response
      expect(response).toEqual({
        ok: false,
        error: errorMessage,
      });
    });
  });
});