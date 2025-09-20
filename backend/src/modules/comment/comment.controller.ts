import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('post/:slug')
  async getCommentsByPostSlug(@Param('slug') slug: string, @Query() paginationDto: PaginationDto) {
    return this.commentService.getCommentsByPostSlug(slug, paginationDto);
  }

  @Get(':id/replies')
  async getReplies(@Param('id') id: number, @Query() paginationDto: PaginationDto) {
    return this.commentService.getReplies(id, paginationDto);
  }

  @Auth()
  @Post('post/:slug')
  async createComment(@Param('slug') slug: string, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(slug, createCommentDto);
  }

  @Auth()
  @Patch(':id')
  async updateComment(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateComment(Number(id), updateCommentDto);
  }

  @Auth()
  @Delete(':id')
  async deleteComment(@Param('id') id: number) {
    return this.commentService.deleteComment(Number(id));
  }
}
