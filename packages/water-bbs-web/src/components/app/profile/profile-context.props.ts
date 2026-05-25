import type { ComputedRef, InjectionKey } from 'vue';

export type ProfileContextModelValue = {
  username: string;
  avatar: string;
  bio: string;
};

export type ProfileContextProps = {
  editable?: boolean;
};
export type ProfileContext = {
  editable?: ComputedRef<boolean>;
  setField: <N extends keyof ProfileContextModelValue>(name: N, value: ProfileContextModelValue[N]) => void;
  data: ComputedRef<ProfileContextModelValue>;
};

export const ProfileContextKey: InjectionKey<ProfileContext> = Symbol('profile.context');
