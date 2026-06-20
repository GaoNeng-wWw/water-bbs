import { InjectUrlResolver, UrlResolver } from '@app/storage';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { FileReference, Resource, ResourceOwnerMap } from 'water-bbs-migration';
import { DomainError, err, isErr, ok, Result } from 'water-bbs-shared';

export type ThreadResourceState =
  | {
      unlocked: true;
      url: string;
    }
  | {
      unlocked: false;
      cost: number;
    };

export type ThreadResource = {
  fileName: string;
  mimeType: string;
} & ThreadResourceState;

export type Response = {
  resources: ThreadResource[];
};

export class GetThreadResourcesQuery extends Query<
  Result<Response, DomainError>
> {
  constructor(
    public readonly threadId: string,
    public readonly visitor: string,
  ) {
    super();
  }
}

@QueryHandler(GetThreadResourcesQuery)
export class GetThreadResourcesQueryHandler implements IQueryHandler<GetThreadResourcesQuery> {
  constructor(
    @InjectRepository(Resource)
    private readonly repo: EntityRepository<Resource>,
    @InjectRepository(ResourceOwnerMap)
    private readonly onwerRepo: EntityRepository<ResourceOwnerMap>,
    @InjectRepository(FileReference)
    private readonly fr: EntityRepository<FileReference>,
    @InjectUrlResolver()
    private readonly urlResolver: UrlResolver,
  ) {}
  async execute(
    query: GetThreadResourcesQuery,
  ): Promise<Result<Response, DomainError>> {
    const resources = await this.repo.find({
      subject: query.threadId,
    });
    const onwerResource = await this.onwerRepo.find({
      owner: query.visitor,
      resourceId: {
        $in: resources.map((r) => r.id),
      },
    });
    const unlockedResources = onwerResource.map((ur) => ur.id);
    const resp: ThreadResource[] = [];
    for (const resource of resources) {
      const unlocked = unlockedResources.includes(resource.id);
      const fr = await this.fr.findOne({
        storageKey: resource.fileReferenceId,
      });
      if (!fr) {
        return err(new DomainError('RESOURCE_NOT_FOUND'));
      }
      if (unlocked) {
        const urlResult = await this.urlResolver.getUrl(fr);
        if (isErr(urlResult)) {
          return err(new DomainError('INVALID_FILE'));
        }
        const url = urlResult.value;
        resp.push({
          unlocked,
          url,
          fileName: fr.name,
          mimeType: fr.mimeType,
        });
        continue;
      }
      resp.push({
        unlocked,
        cost: resource.cost,
        fileName: fr.name,
        mimeType: fr.mimeType,
      });
    }
    return ok({
      resources: resp,
    });
  }
}
