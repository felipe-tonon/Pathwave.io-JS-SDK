# Pathwave.io JavaScript SDK

A minimal TypeScript SDK for connecting AI agents to the Pathwave platform. Pathwave bridges TypeScript AI agents to MCPs like PayPal and Gmail.

## Installation

```bash
npm install pathwave.io-js-sdk
```

## Requirements

- Node.js 20 or later
- An active Pathwave account with a User SID

## Configuration

The SDK requires a single environment variable:

- `PATHWAVE_USER_SID`: Your Pathwave user identifier

You can set this in your environment or in a `.env` file at the root of your project.

## Quickstart

```typescript
import { PathwaveClient } from "pathwave.io-js-sdk";

// Set environment variable (if not using a .env file)
process.env.PATHWAVE_USER_SID = "your-user-sid";

// Create the client
const client = new PathwaveClient();

// Invoke a tool
async function makePayment() {
  const response = await client.invokeTool("paypal.payout", {
    amount: 10,
    currency: "CHF",
  });

  if (response.ok) {
    console.log("Payment successful:", response.data);
  } else {
    console.error("Payment failed:", response.error);
  }
}

makePayment().catch(console.error);
```

## API Reference

### `PathwaveClient`

The main client class for interacting with the Pathwave API.

#### Constructor

```typescript
constructor()
```

Creates a new client instance. Throws an error if `PATHWAVE_USER_SID` environment variable is not set.

#### Methods

##### `invokeTool`

```typescript
async invokeTool(tool: string, args: Record<string, any>): Promise<PathwaveResponse>
```

Invokes a Pathwave tool with the specified arguments.

- `tool`: The name of the tool to invoke
- `args`: An object containing the arguments for the tool

Returns a `PathwaveResponse` object:

```typescript
{
  ok: boolean;       // Whether the request was successful
  data?: any;        // The response data (if successful)
  error?: string;    // Error message (if failed)
}
```

### Types

#### `ToolCall`

```typescript
{
  name: string;               // Name of the tool
  args: Record<string, any>;  // Arguments for the tool
}
```

#### `AgentContext`

```typescript
{
  agentId: string;   // ID of the agent
  sessionId: string; // Current session ID
}
```

## Security

Never hardcode your `PATHWAVE_USER_SID` in your source code. Always use environment variables or a `.env` file.

## Development

```bash
# Install dependencies
npm ci

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Build the package
npm run build

# Check environment variables
npm run env:check
```

## License

MIT