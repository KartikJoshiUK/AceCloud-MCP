import { z } from "zod";
import { ErrorResponse } from "../types";
import { isAuthenticated } from "../services/auth";

export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{
    [key: string]: unknown;
    type: "text";
    text: string;
  }>;
  _meta?: {
    [key: string]: unknown;
  };
  structuredContent?: {
    [key: string]: unknown;
  };
  isError?: boolean;
}

export interface ToolErrorOptions {
  message: string;
  code?: string;
  details?: any;
}

export function withAuthentication<T extends object>(
  handler: (args: T) => Promise<ToolResponse>
): (args: T) => Promise<ToolResponse> {
  return async (args: T) => {
    if (!isAuthenticated()) {
      return {
        content: [
          {
            type: "text",
            text: "Please login first",
          },
        ],
      };
    }
    return handler(args);
  };
}

export function withErrorHandling<T extends object>(
  handler: (args: T) => Promise<ToolResponse>
): (args: T) => Promise<ToolResponse> {
  return async (args: T) => {
    try {
      return await handler(args);
    } catch (error: any) {
      const errorResponse = error.response?.data as ErrorResponse;
      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorResponse?.message || error.message}`,
          },
        ],
      };
    }
  };
}

export function createToolHandler<T extends object>(
  handler: (args: T) => Promise<ToolResponse>,
  authenticate: boolean = true,
): (args: T) => Promise<ToolResponse> {
  if (authenticate) {
    return withErrorHandling(withAuthentication(handler));
  }
  return withErrorHandling(handler);
}
