import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommentModule } from '../comment/comment.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [PrismaModule, CommentModule, CloudinaryModule],
  exports: [PostService],
})
export class PostModule {}
