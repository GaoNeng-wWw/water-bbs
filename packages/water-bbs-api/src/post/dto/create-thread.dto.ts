import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Thread } from '../entities/thread';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThread {
  @ApiProperty()
  @IsString()
  public content: string;
}

export class CreateThreadResponse {
  @Expose()
  public postId: string;
  @Expose()
  public thread: Thread;
  constructor(postId: string, thread: Thread) {
    this.postId = postId;
    this.thread = thread;
  }
}
