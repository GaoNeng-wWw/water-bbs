import { accountControllerGetAccountProfile, accountControllerUpdateProfile, type GetProfileResponse, type UpdateProfileDto } from '@/api';
import { reactive, ref, toValue, watch, type MaybeRefOrGetter } from 'vue';
import { NOT_PUBLIC_ENDPOINT } from './use-api';

export type UseAccountProfile = {
  id: MaybeRefOrGetter<string>;
  editable: MaybeRefOrGetter<boolean>;
};

export const useAccountProfile = (
  props: UseAccountProfile,
) => {
  const { id, editable } = props;
  const profile = reactive<GetProfileResponse>({
    id: '',
    username: '',
    bio: '',
    avatar: '',
  });

  const loading = ref(false);
  const fetchProfile = (id: string) => {
    loading.value = true;
    accountControllerGetAccountProfile({ path: { id } })
      .then(resp => resp.data)
      .then(data => Object.assign(profile, data))
      .finally(() => {
        loading.value = false;
      });
  };
  const patchProfile = (profile: Partial<UpdateProfileDto>) => {
    if (loading.value) {
      return;
    }
    accountControllerUpdateProfile({
      client: NOT_PUBLIC_ENDPOINT,
      body: {
        bio: profile.bio ?? profile.bio ?? '',
        username: profile.username ?? profile.username ?? '',
      },
    })
      .then(resp => resp.data)
      .then((data) => {
        if (!data) {
          return;
        }
        Object.assign(profile, { bio: data.bio, username: data.username });
      })
      .finally(() => {
        loading.value = false;
      });
  };

  watch(() => id, () => {
    const idValue = toValue(id);
    if (!idValue) {
      return;
    }
    fetchProfile(idValue);
  }, { immediate: true });
  return { patchProfile, fetchProfile, profile, loading, editable };
};
