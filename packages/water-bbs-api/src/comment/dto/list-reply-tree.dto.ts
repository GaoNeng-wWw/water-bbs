import { ApiProperty } from '@nestjs/swagger';

export class ReplyAuthor {
  @ApiProperty({ description: '作者ID' })
  id: string;
  @ApiProperty({ description: '作者昵称' })
  nick: string;
}

export class ReplyNodeMeta {
  @ApiProperty({ description: '下一页游标' })
  nextCursor?: string;
  @ApiProperty({ description: '总回复数' })
  total: number;
}

export class ReplyNode {
  @ApiProperty({ description: '回复节点ID' })
  id: string;
  @ApiProperty({ description: '回复内容' })
  content: string;
  @ApiProperty({ description: '回复作者', type: ReplyAuthor })
  author: ReplyAuthor;
  @ApiProperty({ description: '是否可展开' })
  expandable: boolean;
}

export class ReplyTree {
  @ApiProperty({ description: '回复节点列表', type: [ReplyNode] })
  nodes: ReplyNode[];
  @ApiProperty({ description: '分页元数据', type: ReplyNodeMeta })
  meta: ReplyNodeMeta;
}
