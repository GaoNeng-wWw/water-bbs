import { walletControllerGetBalance } from '@/api';
import { readonly, ref } from 'vue';
import { NOT_PUBLIC_ENDPOINT } from './use-api';

export const useWallet = () => {
  const balance = ref('');
  const getBalance = () => {
    walletControllerGetBalance({
      client: NOT_PUBLIC_ENDPOINT,
    })
      .then((resp) => {
        balance.value = resp.data?.balance ?? '0';
      });
  };
  return {
    getBalance,
    balance: readonly(balance),
  };
};
