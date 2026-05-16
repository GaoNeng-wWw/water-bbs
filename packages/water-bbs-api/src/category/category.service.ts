import { Injectable } from '@nestjs/common';
import { isErr, ok } from 'water-bbs-shared';
import { CategoryRepo } from './category.repo';
import { Category } from 'water-bbs-migration';
import { CategorySummary } from './entities/category-summary.entry';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}
  async createCategory(name: string, parent?: string) {
    const category = new Category(name, parent);
    const upsertCategoryRes = await this.categoryRepo.upsert(category);
    if (isErr(upsertCategoryRes)) {
      return upsertCategoryRes;
    }
    return upsertCategoryRes.value;
  }
  async removeCategory(id: string) {
    const categoryRes = await this.categoryRepo.find(id);
    if (isErr(categoryRes)) {
      return categoryRes;
    }
    if (!categoryRes.value) {
      return categoryRes;
    }
    const category = categoryRes.value;
    category.remove();
    const upsertRes = await this.categoryRepo.upsert(category);
    if (isErr(upsertRes)) {
      return upsertRes;
    }
    return ok(category);
  }
  async updateCategory(id: string, name?: string, parent?: string | null) {
    const categoryRes = await this.categoryRepo.find(id);
    if (isErr(categoryRes)) {
      return categoryRes;
    }
    if (!categoryRes.value) {
      return categoryRes;
    }
    const category = categoryRes.value;
    if (name) {
      category.name = name;
    }
    if (parent !== undefined) {
      category.parentID = parent;
    }
    const upsertRes = await this.categoryRepo.upsert(category);
    if (isErr(upsertRes)) {
      return upsertRes;
    }
    return upsertRes.value;
  }
  findCategory(id: string) {
    return this.categoryRepo.find(id);
  }
  async listCategories(parent?: string) {
    const listRes = await this.categoryRepo.list(parent);
    if (isErr(listRes)) {
      return listRes;
    }
    const rawItems = listRes.value;
    const summaries = rawItems.map(
      (item) =>
        new CategorySummary(
          item.id,
          item.name,
          item.hasChildren,
          item.parentID,
        ),
    );
    return summaries;
  }
}
