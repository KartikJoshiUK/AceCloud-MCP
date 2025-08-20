import axios from 'axios';
import { config } from '../config';
import { getSessionToken } from './auth';
import { ErrorResponse } from '../types';

const api = axios.create({
  baseURL: config.backendBaseUrl
});

api.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${getSessionToken()}`
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data as ErrorResponse;
    throw new Error(`API Error: ${errorData?.message || error.message}`);
  }
);

export async function getSecurityGroups(region: string, projectId: string) {
  try {
    const response = await api.get('/cloud/security-groups', {
      params: { region, project_id: projectId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getKeyPairs(region: string, projectId: string) {
  try {
    const response = await api.get('/cloud/key-pairs', {
      params: { region, project_id: projectId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getInstances(region: string, projectId: string) {
  try {
    const response = await api.get('/cloud/instances', {
      params: { region, project_id: projectId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getWalletDetails() {
  try {
    const response = await api.get('/cloud/wallet');
    return response.data;
  } catch (error) {
    throw error;
  }
}
