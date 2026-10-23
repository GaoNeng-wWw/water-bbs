import { getProfile } from '@/api';
import { client } from '@/api/client.gen';
import { useAuthStore, useProfile } from '@/store';
import type { Router } from 'vue-router';

export default function (router: Router) {
  const authStore = useAuthStore();
  const profileStore = useProfile();
  router.beforeEach(async () => {
    if (profileStore.profile !== null || !authStore.accessToken) {
      return true;
    }
    return getProfile({ client })
      .then(resp => resp.data)
      .then((data) => {
        if (!data) {
          return true;
        }
        profileStore.setProfile(data);
        return true;
      });
  });
}
