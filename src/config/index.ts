import { AceCloudConfig } from '../types';

const defaultConfig: AceCloudConfig = {
  baseUrl: "https://customer.acecloudhosting.com/app/api",
  backendBaseUrl: "https://customer.acecloudhosting.com/api/v1",
  email: process.env.ACE_MCP_EMAIL || '',
  password: process.env.ACE_MCP_PASSWORD || '',
};

if (!defaultConfig.email || !defaultConfig.password) {
  throw new Error("Email and password must be provided");
}
console.log(defaultConfig);

export const config = defaultConfig;

export function validateConfig(config: AceCloudConfig): void {
  if (!config.email || !config.password) {
    throw new Error("Configuration validation failed: Email and password are required");
  }
  if (!config.baseUrl || !config.backendBaseUrl) {
    throw new Error("Configuration validation failed: Base URL and Cloud URL are required");
  }
}

// Validate config on import
validateConfig(config);
