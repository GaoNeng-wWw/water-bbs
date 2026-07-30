import { CategoryId } from '../entities';

export class CategoryCreated {
  constructor(public readonly id: CategoryId) {}
}
