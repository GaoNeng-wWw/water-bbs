import { PaginationData } from '@app/shared';
import { ReplyItem } from './find-reply.dto';

export class ListReplyResponse extends PaginationData<ReplyItem> {
  constructor(data: ReplyItem[], total: number) {
    super(data, total);
  }
}
