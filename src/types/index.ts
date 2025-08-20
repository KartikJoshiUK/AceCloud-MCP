export interface AceCloudConfig {
  baseUrl: string;
  backendBaseUrl: string;
  email: string;
  password: string;
}

export interface SecurityGroup {
  id: string;
  name: string;
  description?: string;
  region: string;
  project_id: string;
}

export interface KeyPair {
  id: string;
  name: string;
  fingerprint: string;
  region: string;
  project_id: string;
}

export interface AuthenticationResponse {
  data : {
    accessToken: string;
    whmcsCookie: object;
    expiresInSeconds: number;
  }
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}
