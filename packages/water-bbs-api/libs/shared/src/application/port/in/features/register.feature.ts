import { ok, pipeResult, Result } from 'water-bbs-shared';
import { Inject, Injectable } from '@nestjs/common';
import {
  InjectFeatureLoader,
  type IFeatureLoader,
} from '../../out/features/features.interface';
import { PolicyError } from './errors';
import z from 'zod';

export interface IRegisterPolicy {
  requireInviteCode(): Promise<Result<boolean, PolicyError>>;
  requireCaptcha(): Promise<Result<boolean, PolicyError>>;
}

export const REGISTER_POLICY_TOKEN = Symbol('REGISTER_POLICY');
export const InjectRegisterPolicy = () => Inject(REGISTER_POLICY_TOKEN);

@Injectable()
export class RegisterPolicy implements IRegisterPolicy {
  constructor(
    @InjectFeatureLoader() private featureLoader: IFeatureLoader<string>,
  ) {}

  async requireInviteCode(): Promise<Result<boolean, PolicyError>> {
    const res = pipeResult(
      await this.featureLoader.load<boolean>(z.boolean(), [
        'ENABLE_INVITE_CODE',
      ]),
    );
    if (res.isErr()) {
      return res;
    }
    return ok(res.unwrap());
  }
  async requireCaptcha(): Promise<Result<boolean, PolicyError>> {
    const res = pipeResult(
      await this.featureLoader.load<boolean>(z.boolean(), ['ENABLE_CAPTCHA']),
    );
    if (res.isErr()) {
      return res;
    }
    return ok(res.unwrap());
  }
}
