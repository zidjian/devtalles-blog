import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // TODO: Implement pagination
  @Get('post/:slug')
  async getCommentsByPostSlug(@Param('slug') slug: string, @Query() paginationDto: PaginationDto) {
    return this.commentService.getCommentsByPostSlug(slug, paginationDto);
  }

  @Get(':id/replies')
  async getReplies(@Param('id') id: number, @Query() paginationDto: PaginationDto) {
    return this.commentService.getReplies(id, paginationDto);
  }

  @Post('post/:slug')
  async createComment(@Param('slug') slug: string, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(slug, createCommentDto);
  }

  @Patch(':id')
  async updateComment(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateComment(Number(id), updateCommentDto);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: number) {
    return this.commentService.deleteComment(Number(id));
  }
}
