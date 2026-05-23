import type { GetProfileResponse } from '@/api';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const profile: Ref<GetProfileResponse | null> = ref(null);
  const setProfile = (resp: GetProfileResponse | null) => {
    profile.value = resp;
  };
  return { profile, setProfile };
}, { persist: false });
