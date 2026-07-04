import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAccountWallet = defineStore('store', () => {
  const balance = ref('');
  const setBalacne = (
    newBalance: string,
  ) => {
    balance.value = newBalance;
  };
  const incrBalance = (value: number) => {
    balance.value = `${Number.parseFloat(balance.value) + value}`;
  };
  return { setBalacne, incrBalance, balance };
});
