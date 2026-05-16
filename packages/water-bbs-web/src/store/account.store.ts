import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAccount = defineStore('account', () => {
  const accessToken = ref('');
  const refreshToken = ref('');
  const setTokenPair = (at: string, rt: string) => {
    accessToken.value = at;
    refreshToken.value = rt;
  };
  const isLogged = computed(() => !!accessToken.value);
  return { accessToken, refreshToken, setTokenPair, isLogged };
}, {
  persist: {
    storage: localStorage,
    pick: ['accessToken', 'refreshToken']
  },
});
