import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('');
  const refreshToken = ref('');
  const loggedIn = computed(() => !!accessToken.value);
  const setAccessToken = (token: string) => {
    accessToken.value = token;
  };
  const setRefreshToken = (token: string) => {
    refreshToken.value = token;
  };
  return {
    accessToken,
    refreshToken,
    loggedIn,
    setAccessToken,
    setRefreshToken,
  };
}, { persist: true });
