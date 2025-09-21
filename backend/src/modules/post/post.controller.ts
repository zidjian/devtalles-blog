import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterPostDto } from './dto/filter-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @GetUser('id') userId: number,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.postService.createPost(userId, createPostDto, image);
  }

  @Get()
  async getAllPosts(@Query() filterPostDto: FilterPostDto) {
    return this.postService.getAllPosts(filterPostDto);
  }

  @Auth()
  @Get('user')
  async getAllPostsByUserId(
    @GetUser('id') userId: number,
    @Query() filterPostDto: FilterPostDto,
  ) {
    return this.postService.getAllPostsByUserId(Number(userId), filterPostDto);
  }

  @Get('id/:id')
  async getPostById(@Param('id') id: number) {
    return this.postService.getPostById(Number(id));
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return this.postService.getPostBySlug(slug);
  }

  @Auth()
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @Param('id') id: number,
    @GetUser('id') userId: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postService.updatePost(Number(id), userId, updatePostDto, file);
  }

  @Auth()
  @Delete(':postId')
  async deletePost(@Param('postId') postId: number) {
    return this.postService.deletePost(postId);
  }

  @Auth()
  @Post('like/:postId')
  async likePost(
    @GetUser('id') userId: number,
    @Param('postId') postId: number,
  ) {
    return this.postService.likePost(userId, postId);
  }

  @Auth()
  @Post('unlike/:postId')
  async unlikePost(
    @GetUser('id') userId: number,
    @Param('postId') postId: number,
  ) {
    return this.postService.unlikePost(userId, postId);
  }

  @Auth()
  @Get('liked')
  async getLikedPostsByUserId(
    @GetUser('id') userId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.postService.getLikedPostsByUserId(
      Number(userId),
      paginationDto,
    );
  }

  @Auth()
  @Get('statistics')
  async getStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.postService.getStatistics(startDate, endDate);
  }
}
