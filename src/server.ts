import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getSecurityGroups, getKeyPairs, getInstances } from "./services/api";
import { authenticate } from "./services/auth";

export const server = new McpServer({
  name: "acecloud",
  version: "1.0.0",
  capabilities: {
    resources: {
      "access-token": {
        description: "ACE Cloud access token",
        schema: z.object({
          token: z.string(),
          expires_at: z.number(),
        }),
      },
    },
    tools: {},
  },
});

import { createToolHandler } from "./utils/tool-helpers";

interface SecurityGroupParams {
  region: string;
  project_id: string;
}

const handleSecurityGroups = createToolHandler(async (args: SecurityGroupParams) => {
  const securityGroups = await getSecurityGroups(args.region, args.project_id);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(securityGroups),
      },
    ],
  };
});

const handleKeyPairs = createToolHandler(async (args: SecurityGroupParams) => {
  const keyPairs = await getKeyPairs(args.region, args.project_id);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(keyPairs),
      },
    ],
  };
});

const handleInstances = createToolHandler(async (args: SecurityGroupParams) => {
  const instances = await getInstances(args.region, args.project_id);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(instances),
      },
    ],
  };
});

const handleLogin = createToolHandler(async () => {
  const response = await authenticate();
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(response),
      },
    ],
  };
}, false);

server.tool(
  "list-all-security-groups",
  "List all security groups",
  {
    region: z.string(),
    project_id: z.string(),
  },
  handleSecurityGroups
);

server.tool(
  "list-all-key-pairs",
  "List all key pairs",
  {
    region: z.string(),
    project_id: z.string(),
  },
  handleKeyPairs
);

server.tool(
  "list-all-instances",
  "List all instances",
  {
    region: z.string(),
    project_id: z.string(),
  },
  handleInstances
);

server.tool(
  "login_to_acecloud_return_user_details",
  "Login to acecloud and return user details.",
  {},
  handleLogin
);

export async function startServer(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
