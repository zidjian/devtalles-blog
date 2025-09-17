import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [PrismaModule, CommentModule],
  exports: [PostService],
})
export class PostModule {}
