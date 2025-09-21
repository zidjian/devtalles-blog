import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CommentService } from '../comment/comment.service';
import { CreatePostDto } from './dto/create-post.dto';
import slugify from 'slugify';
import { postInclude, postOrderBy } from './constants/postInclude.const';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { FilterPostDto } from './dto/filter-post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commentService: CommentService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private buildWhereFromFilters(f: FilterPostDto): Prisma.PostWhereInput {
    const and: Prisma.PostWhereInput[] = [];

    if (f.title?.trim()) {
      and.push({
        title: {
          contains: f.title.trim(),
          mode: 'insensitive',
        },
      });
    }

    if (f.categoryId) {
      and.push({
        categories: {
          some: {
            categoryId: {
              equals: f.categoryId,
            },
          },
        },
      });
    }

    return and.length ? { AND: and } : {};
  }

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
    image?: Express.Multer.File,
  ) {
    const { title, slug, content, categoryIds } = createPostDto;

    let result: UploadApiResponse;

    let postSlug =
      slug ||
      slugify(title, {
        lower: true,
        remove: /[*+~.()]/g,
      });

    const exists = await this.prisma.post.findUnique({
      where: { slug: postSlug },
    });

    if (exists) {
      throw new BadRequestException('Post with this slug already exists');
    }

    const [user, categoriesCount] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.category.count({ where: { id: { in: categoryIds } } }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (categoriesCount !== categoryIds.length) {
      throw new NotFoundException('Some categories not found');
    }

    if (image) {
      result = await this.cloudinaryService.uploadFile(image, 'post-images');

      if (!result) {
        throw new BadRequestException('Failed to upload image');
      }
    }

    // transaction
    return this.prisma.$transaction(async (prisma) => {
      const post = await prisma.post.create({
        data: {
          title,
          slug: postSlug,
          content,
          userId,
          image: result?.secure_url,
        },
      });

      await prisma.postCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          postId: post.id,
          categoryId,
        })),
      });

      return post;
    });
  }

  async getPostBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    const categories = post.categories.map((pc) => pc.category);

    const comments = await this.commentService.getCommentsByPostSlug(slug, {
      page: 1,
      limit: 5,
    });

    return {
      ...post,
      comments,
      categories,
    };
  }

  async getPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    const categories = post.categories.map((pc) => pc.category);

    return {
      ...post,
      categories,
    };
  }

  private async getPosts(
    where: Prisma.PostWhereInput,
    filterPostDto: FilterPostDto,
  ) {
    const { page = 1, limit = 10 } = filterPostDto;

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: postInclude,
        orderBy: postOrderBy,
      }),
      this.prisma.post.count({ where }),
    ]);

    const data = posts.map((post) => ({
      ...post,
      categories: post.categories.map((pc) => pc.category),
    }));

    return {
      data,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async getAllPostsByUserId(userId: number, filterPostDto: FilterPostDto) {
    const baseWhere: Prisma.PostWhereInput = { userId };
    const extraWhere = filterPostDto
      ? this.buildWhereFromFilters(filterPostDto)
      : {};

    const where = Object.keys(extraWhere).length
      ? { AND: [baseWhere, extraWhere] }
      : baseWhere;

    return this.getPosts(where, filterPostDto);
  }

  async getAllPosts(filterPostDto: FilterPostDto) {
    const where = this.buildWhereFromFilters(filterPostDto);
    return this.getPosts(where, filterPostDto);
  }

  async updatePost(
    id: number,
    userId: number,
    updatePostDto: any,
    file?: Express.Multer.File,
  ) {
    const { title, slug, content, categoryIds } = updatePostDto;

    const existingPost = await this.prisma.post.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    // Verify ownership
    if (existingPost.userId !== userId) {
      throw new BadRequestException('You can only update your own posts');
    }

    let postSlug = slug;
    if (title && (!slug || slug !== existingPost.slug)) {
      postSlug =
        slug ||
        slugify(title, {
          lower: true,
          remove: /[*+~.()]/g,
        });

      // Check if new slug already exists (but not for current post)
      const slugExists = await this.prisma.post.findFirst({
        where: {
          slug: postSlug,
          id: { not: id },
        },
      });

      if (slugExists) {
        throw new BadRequestException('Post with this slug already exists');
      }
    }

    // Validate categories if provided
    if (categoryIds && categoryIds.length > 0) {
      const categoriesCount = await this.prisma.category.count({
        where: { id: { in: categoryIds } },
      });

      if (categoriesCount !== categoryIds.length) {
        throw new NotFoundException('Some categories not found');
      }
    }

    let result: any;
    if (file) {
      result = await this.cloudinaryService.uploadFile(file, 'post-images');
      if (!result) {
        throw new BadRequestException('Failed to upload image');
      }
    }

    // Update post in transaction
    return this.prisma.$transaction(async (prisma) => {
      // Update post
      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(postSlug && { slug: postSlug }),
          ...(content && { content }),
          ...(result?.secure_url && { image: result.secure_url }),
        },
      });

      // Update categories if provided
      if (categoryIds && categoryIds.length > 0) {
        // Remove old categories
        await prisma.postCategory.deleteMany({
          where: { postId: id },
        });

        // Add new categories
        await prisma.postCategory.createMany({
          data: categoryIds.map((categoryId: number) => ({
            postId: id,
            categoryId,
          })),
        });
      }

      return updatedPost;
    });
  }

  async deletePost(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.postCategory.deleteMany({ where: { postId: id } });
      await tx.comment.deleteMany({ where: { postId: id } });
      await tx.like.deleteMany({ where: { postId: id } });

      return tx.post.delete({ where: { id } });
    });
  }

  async likePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      throw new NotFoundException('Post already liked by this user');
    }

    return this.prisma.like.create({
      data: { userId, postId },
    });
  }

  async unlikePost(userId: number, postId: number) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (!existingLike) {
      throw new NotFoundException('Like not found for this user and post');
    }

    return this.prisma.like.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }

  async getLikedPostsByUserId(userId: number, paginationDto: PaginationDto) {
    const where = {
      likes: {
        some: {
          userId,
        },
      },
    };
    return this.getPosts(where, paginationDto);
  }

  async getStatistics(startDate?: string, endDate?: string) {
    const where: any = {};

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [totalPosts, totalLikes] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.like.count({
        where: {
          ...(startDate &&
            endDate && {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }),
        },
      }),
    ]);

    return {
      totalPosts,
      totalLikes,
    };
  }
}
