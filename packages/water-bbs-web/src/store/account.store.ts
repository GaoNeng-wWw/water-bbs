import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAccount = defineStore('account', () => {
  const accessToken = ref('');
  const refreshToken = ref('');
  const setTokenPair = (at: string, rt: string) => {
    accessToken.value = at;
    refreshToken.value = rt;
  };
  return { accessToken, refreshToken, setTokenPair };
}, {
  persist: true,
});
