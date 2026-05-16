import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostApplicationService } from './post.service';
import { CreatePostDTO, CreatePostResponse } from './dto/create-post.dto';
import {
  ApiCursorPaginatedResponse,
  CursorPagination,
  Permission,
  UseModel,
  User,
} from '@app/shared';
import { HiddenPostDTO, HiddenPostResponse } from './dto/hidden-post.dto';
import { PostSummary } from './entities/post-summary';
import { ApiCreatedResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostApplicationService) {}

  @ApiCreatedResponse({
    type: CreatePostResponse,
    description: 'Create a new post',
  })
  @UseModel(CreatePostResponse)
  @Post()
  createPost(@Body() body: CreatePostDTO, @User() user: RequestUser) {
    return this.postService.createPost(
      body.categoryId,
      body.title,
      body.content,
      user.account.id,
    );
  }

  @ApiOkResponse({
    type: PostSummary,
    description: 'Get a post summary',
  })
  @UseModel(PostSummary)
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postService.getPostSummary(id);
  }

  @ApiOkResponse({
    type: HiddenPostResponse,
    description: 'Hide a post.',
  })
  @Permission('post:hidden')
  @UseModel(HiddenPostResponse)
  @Patch(':id')
  hidePost(@Param('id') id: string, @Body() body: HiddenPostDTO) {
    return this.postService.hidePost(id, body.reason);
  }

  @UseModel(CursorPagination)
  @ApiCursorPaginatedResponse(PostSummary)
  @ApiQuery({ name: 'category', description: 'Category ID' })
  @ApiQuery({ name: 'preId', description: 'Previous post ID' })
  @ApiQuery({ name: 'size', description: 'Page size' })
  @Get('')
  getPosts(
    @Query('size', new DefaultValuePipe(10), ParseIntPipe)
    size: number,
    @Query('preId')
    preId?: string,
    @Query('category')
    categoryId?: string,
  ) {
    return this.postService.getPosts(size, preId, categoryId);
  }
}
