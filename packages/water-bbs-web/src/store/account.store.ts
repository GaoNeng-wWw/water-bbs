import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';

type AccessTokenPayload = {
  exp: number;
  iat: number;
  jti: string;
  sessionID: string;
  sub: string;
  tokenType: string;
  ttl: number;
};

export const useAccount = defineStore('account', () => {
  const accessToken = ref('');
  const refreshToken = ref('');
  const permissions = ref<string[]>([]);
  const setTokenPair = (at: string, rt: string) => {
    accessToken.value = at;
    refreshToken.value = rt;
  };
  const accessTokenPayload = computed(() => accessToken.value ? (jwtDecode<AccessTokenPayload>(accessToken.value)) : null);
  const accountId = computed(() => accessTokenPayload.value?.sub);
  const logout = () => {
    setTokenPair('', '');
    permissions.value = [];
  };
  const setPermissions = (p: string[]) => {
    permissions.value = p;
  };
  const hasPermission = (p: string) => {
    return permissions.value.includes('*') || permissions.value.includes(p);
  };
  const isLogged = computed(() => !!accessToken.value);
  return { accessToken, refreshToken, accountId, setTokenPair, isLogged, logout, permissions, setPermissions, hasPermission };
}, {
  persist: {
    storage: localStorage,
    pick: ['accessToken', 'refreshToken', 'permissions'],
  },
});
