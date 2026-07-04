import { accountControllerCheckIn, accountControllerGetCheckInStatus } from '@/api';
import { useAccount, useAccountWallet } from '@/store';
import { ref } from 'vue';
import { NOT_PUBLIC_ENDPOINT } from './use-api';

export const useCheckedIn = () => {
  const checkinLoading = ref(true);
  const checked = ref(false);
  const account = useAccount();
  const accountWallet = useAccountWallet();
  if (account.isLogged) {
    accountControllerGetCheckInStatus({
      client: NOT_PUBLIC_ENDPOINT,
    })
      .then(resp => resp.data)
      .then((data) => {
        if (!data) {
          return;
        }
        checked.value = data.checked;
      })
      .finally(() => {
        checkinLoading.value = false;
      });
  }
  const checkIn = () => {
    if (checkinLoading.value) {
      return;
    }
    checkinLoading.value = true;
    accountControllerCheckIn({
      client: NOT_PUBLIC_ENDPOINT,
    })
      .then((reasp) => {
        const balance = reasp.data?.balance ?? 0;
        accountWallet.incrBalance(balance);
        checked.value = true;
      })
      .finally(() => {
        checkinLoading.value = false;
      });
  };
  return { checkIn, checkinLoading, checked };
};
