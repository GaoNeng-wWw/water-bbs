import { ValueObject } from 'types-ddd';

export type ProfileProp = {
  name: string;
  bio?: string;
  avatar?: string;
};

export class Profile extends ValueObject<ProfileProp> {
  constructor(prop: ProfileProp) {
    super(prop);
  }
}
