import type { ProfileInfo } from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfile = defineStore('profile', () => {
  const profile = ref<ProfileInfo | null>(null);
  const setProfile = (info: ProfileInfo) => {
    profile.value = info;
  };
  return { profile, setProfile };
}, {persist: true});
