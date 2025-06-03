import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { z } from "zod";

const ACE_CLOUD_BASE_URL = "https://customer.acecloudhosting.com/app/api";
const ACE_CLOUD_CLOUD_URL = "https://customer.acecloudhosting.com/api/v1/cloud";

let sessionAccessToken: string | null = null;

// Create server instance
const server = new McpServer({
  name: "weather",
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

server.tool(
  "login-to-acecloud-and-return-accesstoken",
  "Log in to acecloud using username and password and return access token",
  {
    email: z.string().email(),
    password: z.string(),
  },
  async ({ email, password }) => {
    try {
      const response = await axios.post<{data: any}>(
        ACE_CLOUD_BASE_URL+"/auth/login",
        {email, password}
      );
      let responseData = {}
      if(response?.data?.data){
        const {accessToken, whmcsCookie, expiresInSeconds, ...rest} = response.data.data
        sessionAccessToken = accessToken;
        responseData = rest
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              message : "Login successful",
              data : responseData
            }),
          },
        ],
      };
      
      
    } catch (error: any) {
      if (error?.isAxiosError) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.response?.data?.message || error.message}`,
            },
          ],
        };
      }
      throw error;
    }
  }
);


server.tool(
  "list-all-security-groups",
  "List all security groups",
  {
    region: z.string(),
    project_id: z.string(),
  },
  async ({ region, project_id }) => {
    try {
      if(!sessionAccessToken){
        return {
          content: [
            {
              type: "text",
              text: "Please login first",
            },
          ],
        };
      }
      const response : {data : object} = await axios.get(
        ACE_CLOUD_CLOUD_URL+"/security-groups",
        {headers: {Authorization: `Bearer ${sessionAccessToken}`}, params: {region, project_id}}
      );
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response?.data),
          },
        ],
      };
    } catch (error: any) {
      if (error?.isAxiosError) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.response?.data?.message || error.message}`,
            },
          ],
        };
      }
      throw error;
    }
  }
);

server.tool(
  "list-all-key-pairs",
  "List all key pairs",
  {
    region: z.string(),
    project_id: z.string(),
  },
  async ({ region, project_id }) => {
    try {
      if(!sessionAccessToken){
        return {
          content: [
            {
              type: "text",
              text: "Please login first",
            },
          ],
        };
      }
      const response : {data : object} = await axios.get(
        ACE_CLOUD_CLOUD_URL+"/key-pairs",
        {headers: {Authorization: `Bearer ${sessionAccessToken}`}, params: {region, project_id}}
      );
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response?.data),
          },
        ],
      };
    } catch (error: any) {
      if (error?.isAxiosError) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.response?.data?.message || error.message}`,
            },
          ],
        };
      }
      throw error;
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
