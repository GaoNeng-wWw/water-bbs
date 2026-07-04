import { walletControllerGetBalance } from '@/api';
import { readonly } from 'vue';
import { NOT_PUBLIC_ENDPOINT } from './use-api';
import { useAccountWallet } from '@/store';
import { storeToRefs } from 'pinia';

export const useWallet = () => {
  const accountWallet = useAccountWallet();
  const { balance } = storeToRefs(accountWallet);
  const getBalance = () => {
    walletControllerGetBalance({
      client: NOT_PUBLIC_ENDPOINT,
    })
      .then((resp) => {
        accountWallet.setBalacne(resp.data?.balance ?? '0');
      });
  };
  return {
    getBalance,
    balance: readonly(balance),
  };
};
