import { getSelfRecord, type GovernanceMemberInfo } from '@/api';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';

export const useGovernance = defineStore('governance', () => {
  const memberRecord = ref<GovernanceMemberInfo | null>(null);
  getSelfRecord()
    .then(resp => resp.data)
    .then((data) => {
      if (data) {
        memberRecord.value = data;
      }
    });
  const isAdmin = () => {
    return memberRecord.value?.kind === 'admin';
  };
  const isBd = () => {
    return memberRecord.value?.kind === 'bd';
  };
  const canGovernanced = () => {
    return isAdmin() || isBd();
  };
  const untilEnd = computed(() => {
    if (!memberRecord.value) {
      return -1;
    }
    if (isAdmin() || !memberRecord.value.endedAt) {
      return -1;
    }
    const endedAt = new Date(memberRecord.value.endedAt);
    const day = dayjs(endedAt);
    return Number.parseFloat(day.fromNow(true)) || 0;
  });
  return { isAdmin, isBd, canGovernanced, untilEnd };
});
