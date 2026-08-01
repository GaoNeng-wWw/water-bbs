import { DomainError } from '@app/shared';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { AccountId, Profile } from '../../auth';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserNotExists } from '../../auth/errors';
import { UpdateProfile as UpdateProfileDto } from '../dto';

export class UpdateProfile extends Command<Result<void, DomainError>> {
  constructor(
    public readonly accountId: AccountId,
    public readonly updateProfile: UpdateProfileDto,
  ) {
    super();
  }
}

@CommandHandler(UpdateProfile)
export class UpdateProfileService implements ICommandHandler<UpdateProfile> {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: EntityRepository<Profile>,
  ) {}
  async execute({
    accountId,
    updateProfile,
  }: UpdateProfile): Promise<Result<void, DomainError>> {
    const profile = await this.profileRepo.findOne({ accountId });
    if (!profile) {
      return err(new UserNotExists());
    }
    Object.assign(profile, updateProfile);
    await this.profileRepo.upsert(profile);
    return ok();
  }
}
