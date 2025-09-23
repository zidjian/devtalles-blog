import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, AuthModule, CategoryModule, PostModule, CommentModule, CloudinaryModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
