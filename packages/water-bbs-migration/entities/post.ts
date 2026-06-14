import { Entity, Filter, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { BaseMetaEntity } from "./meta";
import { v7 } from "uuid";
import { Collection } from "@mikro-orm/core";

@Filter({
  name: 'notHidden',
  cond: {
    $and: [
      { hidden: false },
      {
        $or: [
          {hideDue: null},
          {hideDue: { $lte: new Date() }}
        ]
      }
    ]
  },
  default: true
})
@Entity()
export class Post extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Property({ type: 'text' })
  title!: string;

  @Property({ type: 'uuid' })
  authorId!: string;

  @Property({ type: 'uuid' })
  categoryId!: string;

  @OneToMany(() => Thread, (thread) => thread.parent)
  threads = new Collection<Thread>(this);
  @Property({ type: 'uuid' })
  version: string;
  @Property({ type: 'int' })
  lastFloor: number = 1;
  @Property({type: 'boolean'})
  hidden: boolean = false;
  @Property({type: 'string', nullable: true})
  hiddenReason: string | null = null;
  @Property({type: 'datetime', nullable: true})
  hideAt: Date | null = null
  @Property({type: 'datetime', nullable: true})
  hideDue: Date | null = null


  constructor(title: string, authorId: string, categoryId: string) {
    super();
    this.title = title;
    this.authorId = authorId;
    this.categoryId = categoryId;
    this.version = v7();
    this.hidden = false;
    this.hiddenReason = null;
  }

  show(){
    this.hidden = false;
    this.hiddenReason = null;
    this.hideAt = null;
  }

  hide(reason: string, due: Date = new Date(), permanent: boolean = false) {
    this.hidden = permanent;
    this.hiddenReason = reason;
    this.hideAt = new Date();
    this.hideDue = due;
  }

  appendThread(thread: Thread) {
    thread.parent = this;
    this.threads.add(thread);
  }
}

@Entity()
export class Thread extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Property({ type: 'text' })
  content!: string;

  @Property({ type: 'uuid' })
  authorId!: string;

  @ManyToOne(() => Post, { nullable: false })
  parent!: Post;

  @OneToMany(() => Reply, (reply) => reply.thread)
  replies = new Collection<Reply>(this);

  @Property({type: 'int'})
  floor: number = 1;

  constructor(content: string, authorId: string, parent: Post, floor?: number) {
    super();
    this.content = content;
    this.authorId = authorId;
    this.parent = parent;
    this.floor = floor ?? parent.lastFloor;
  }


  addReply(reply: Reply) {
    reply.thread = this;
    this.replies.add(reply);
  }
}

@Entity()
export class Reply extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Property({ type: 'text' })
  content!: string;

  // 跨聚合：作者 ID
  @Property({ type: 'uuid' })
  authorId!: string;

  @ManyToOne(() => Thread, { nullable: false })
  thread!: Thread;

  @ManyToOne(() => Reply, { nullable: true })
  parent?: Reply;

  @OneToMany(() => Reply, (reply) => reply.parent)
  children = new Collection<Reply>(this);

  constructor(
    content: string,
    authorId: string,
    thread: Thread,
    parent?: Reply,
  ) {
    super();
    this.content = content;
    this.authorId = authorId;
    this.thread = thread;
    this.parent = parent;
  }

  hasChildren() {
    return this.children.isInitialized() ? !!this.children.length : true;
  }
}
