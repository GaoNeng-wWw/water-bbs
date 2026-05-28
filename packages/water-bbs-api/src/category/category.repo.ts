import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Category } from 'water-bbs-migration';
import { err, ok, PersistenceError } from 'water-bbs-shared';

@Injectable()
export class CategoryRepo {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
  ) {}

  upsert(category: Category) {
    return this.categoryRepo
      .upsert(category)
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
  find(id: string) {
    return this.categoryRepo
      .findOne(id, { cache: true })
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
  list(parent?: string) {
    return this.categoryRepo
      .findAll({
        where: {
          parentID: parent,
        },
      })
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }
}
