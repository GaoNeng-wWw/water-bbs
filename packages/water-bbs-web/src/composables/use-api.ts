import { createClient } from '@/api/client';
import { useAccount } from '@/store';
import { getActivePinia } from 'pinia';

const client = createClient({
  baseURL: '/api',
});

client.instance.interceptors.request.use((config) => {
  const pinia = getActivePinia();
  const accountStore = useAccount(pinia);
  if (accountStore.accessToken) {
    config.headers.Authorization = `Bearer ${accountStore.accessToken}`;
  }
  return config;
});

export const useApi = () => client;
export const usePureApi = () => {
  return createClient({
    baseURL: '/api',
  });
};
export const NOT_PUBLIC_ENDPOINT = useApi();