import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Post, Thread } from 'water-bbs-migration';
import { err, isErr, ok, PersistenceError } from 'water-bbs-shared';

@Injectable()
export class PostRepo {
  constructor(private em: EntityManager) {}
  createPost(
    categoryId: string,
    title: string,
    content: string,
    authorId: string,
  ) {
    const post = new Post(title, authorId, categoryId);
    const thread = new Thread(content, authorId, post);
    return this.em
      .transactional((em) => {
        em.persist(post);
        em.persist(thread);
        return post;
      })
      .then((post) => ok(post))
      .catch((reason) => err(new PersistenceError(reason)));
  }
  updatePost(post: Post) {
    return this.em
      .upsert(Post, post)
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }

  async findById(id: string) {
    const postRes = await this.em
      .findOne(
        Post,
        {
          id: { $eq: id },
          removedAt: { $eq: null },
        },
        { cache: true, populate: ['threads'], populateFilter: {} },
      )
      .then((value) => ok(value))
      .catch((reason) => err(new PersistenceError(reason)));
    if (isErr(postRes)) {
      return postRes;
    }
    const post = postRes.value;
    if (!post) {
      return ok(post);
    }
    const thread = await this.em.findOne(Thread, { parent: post.id });
    if (!thread) {
      return ok(null);
    }
    post.appendThread(thread);
    return ok(post);
  }

  async hidePost(postId: string, reason: string) {
    const postRes = await this.em
      .findOne(Post, { id: { $eq: postId } }, { filters: { notHidden: false } })
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
    if (isErr(postRes)) {
      return postRes;
    }
    const post = postRes.value;
    if (!post) {
      return null;
    }
    post.hide(reason);
    return this.em
      .upsert(Post, post)
      .then(ok)
      .catch((reason) => err(new PersistenceError(reason)));
  }

  listPost(limit: number, preId?: string, categoryId?: string) {
    return this.em
      .findAndCount(
        Post,
        {
          id: preId !== undefined ? { $gt: preId } : { $ne: null },
          categoryId:
            categoryId !== undefined ? { $eq: categoryId } : { $ne: null },
        },
        {
          limit,
          cache: true,
          populate: ['threads.content'],
          populateFilter: {
            threads: { floor: 1 },
          },
        },
      )
      .then((data) => {
        const posts = data[0];
        const total = data[1];
        return ok({
          posts,
          total,
          cursor: posts.length ? posts[posts.length - 1].id : '',
        });
      })
      .catch((reason) => err(new PersistenceError(reason)));
  }
}
