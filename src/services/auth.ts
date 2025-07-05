import axios from 'axios';
import { config } from '../config';
import { AuthenticationResponse, ErrorResponse } from '../types';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

const SESSION_FILE = path.join(__dirname, 'session.json');

type SessionData = {
  sessionAccessToken: string | null;
  tokenExpiresAt: number | null;
};

function readSessionData(): SessionData {
  try {
    const data = readFileSync(SESSION_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      sessionAccessToken: parsed.sessionAccessToken || null,
      tokenExpiresAt: parsed.tokenExpiresAt || null
    };
  } catch (err: any) {
    // If file doesn't exist or is invalid, return nulls
    return { sessionAccessToken: null, tokenExpiresAt: null };
  }
}

function writeSessionData(sessionAccessToken: string, tokenExpiresAt: number): void {
  const data = {
    sessionAccessToken,
    tokenExpiresAt
  };
  writeFileSync(SESSION_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function authenticate(): Promise<unknown> {
  try {
    const response = await axios.post<AuthenticationResponse>(`${config.baseUrl}/auth/login`, {
      email: config.email,
      password: config.password,
    });

    const { accessToken, whmcsCookie, expiresInSeconds, ...rest } = response?.data?.data;
    // Store absolute expiry timestamp
    const absoluteExpiresAt = Date.now() + (expiresInSeconds * 1000);
    writeSessionData(accessToken, absoluteExpiresAt);
    return rest;
  } catch (error: any) {
    const errorResponse = error.response?.data as ErrorResponse;
    throw new Error(`Authentication failed: ${errorResponse?.message || error.message}`);
  }
}

export function isAuthenticated(): boolean {
  const { sessionAccessToken, tokenExpiresAt } = readSessionData();
  if (!sessionAccessToken) return false;
  if (!tokenExpiresAt) return false;
  return tokenExpiresAt > Date.now();
}

export function getSessionToken(): string | null {
  const { sessionAccessToken } = readSessionData();
  return sessionAccessToken;
}
