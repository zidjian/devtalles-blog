import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get()
  async getAllPosts(@Query() paginationDto: PaginationDto) {
    return this.postService.getAllPosts(paginationDto);
  }

  @Get('user/:userId')
  async getAllPostsByUserId(
    @Param('userId') userId: number, 
    @Query() paginationDto: PaginationDto
  ) {
    return this.postService.getAllPostsByUserId(Number(userId), paginationDto);
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return this.postService.getPostBySlug(slug);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }

  @Post('like/:userId/:postId')
  async likePost(@Param('userId') userId: number, @Param('postId') postId: number) {
    return this.postService.likePost(userId, postId);
  }

  @Post('unlike/:userId/:postId')
  async unlikePost(@Param('userId') userId: number, @Param('postId') postId: number) {
    return this.postService.unlikePost(userId, postId);
  }

  @Get('liked/:userId')
  async getLikedPostsByUserId(@Param('userId') userId: number, @Query() paginationDto: PaginationDto) {
    return this.postService.getLikedPostsByUserId(Number(userId), paginationDto);
  }
}
