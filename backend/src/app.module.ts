import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './modules/category/category.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [PrismaModule, CategoryModule, PostModule, CommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
