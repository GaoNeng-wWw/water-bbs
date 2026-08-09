import { refreshToken } from '@/api';
import type { Client } from '@/api/client';
import { useAuthStore } from '@/store';

export function setupInterceptors(client: Client) {
  const authStore = useAuthStore();
  let refreshed = false;
  client.instance.interceptors.request.use((req) => {
    if (authStore.accessToken) {
      req.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(req);
      }, 500);
    });
  });
  client.instance.interceptors.response.use(
    resp => resp,
    (error) => {
      if (error.response?.status === 401 && !refreshed) {
        refreshed = true;
        const token = authStore.refreshToken;
        return refreshToken({
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
          body: {
            token: `Bearer ${token}`,
          },
        })
          .then(resp => resp.data)
          .then((data) => {
            if (!data) {
              authStore.clearToken();
              refreshed = false;
              return Promise.reject(error);
            }
            authStore.setAccessToken(data.accessToken);
            authStore.setRefreshToken(data.refreshToken);
          })
          .catch(() => {
            authStore.clearToken();
            refreshed = false;
            return Promise.reject(error);
          });
      }
      return Promise.reject(error);
    },
  );
}
