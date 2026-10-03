import { Module, OnModuleInit } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Module({})
export class TaskModule implements OnModuleInit {
  constructor(private readonly eb: EventBus) {}
  onModuleInit() {
    this.eb.subscribe((ev) => {
      if (!ev.id) {
        return;
      }
    });
  }
}
