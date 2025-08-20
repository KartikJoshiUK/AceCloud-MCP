# ACECLOUD MCP

ACECLOUD MCP is a ModelContextProtocol server that provides access to ACECLOUD API.

## Installation

```bash
npm install
```

## Step1: Build the File

```bash
npm run build
node {PATH_TO_REPO}/build/index.js
```

# Step2: Setup your MCP Configuration

```json
{
  "mcpServers": {
      "AceMCP": {
          "command": "node",
          "args": [
                "{PATH_TO_REPO}/build/index.js"
            ],
            "env": {
                "ACE_MCP_EMAIL": "example@host.com",
                "ACE_MCP_PASSWORD": "your-password"
            }
      }
  }
}
```

# Step3: Use your tool to connect to MCP and start using it