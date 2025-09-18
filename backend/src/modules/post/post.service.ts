import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CommentService } from '../comment/comment.service';
import { CreatePostDto } from './dto/create-post.dto';
import slugify from 'slugify';
import { postInclude, postOrderBy } from './constants/postInclude.const';

@Injectable()
export class PostService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly commentService: CommentService
    ) {}

    async createPost(createPostDto: CreatePostDto) {
        const { userId, title, slug, content, categoryIds } = createPostDto;

        let postSlug = slug || slugify(title, {
            lower: true,
            remove: /[*+~.()]/g,
        });

        const exists = await this.prisma.post.findUnique({ where: { slug: postSlug } });

        if (exists) {
            throw new BadRequestException('Post with this slug already exists');
        }

        const user = await this.prisma.user.findUnique({ where: { id: userId }});

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const categories = await this.prisma.category.findMany({ where: { id: { in: categoryIds }}});

        if (categories.length !== categoryIds.length) {
            throw new NotFoundException('Some categories not found');
        }

        // transaction
        return this.prisma.$transaction(async (prisma) => {
            const post = await prisma.post.create({
                data: {
                    title,
                    slug: postSlug,
                    content,
                    userId,
                },
            });

            await prisma.postCategory.createMany({
                data: categories.map((category) => ({
                    postId: post.id,
                    categoryId: category.id,
                })),
            });

            return post;
        })
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
                                slug: true,
                            },
                        },
                    }
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
            }
        });

        if (!post) {
            throw new NotFoundException(`Post with slug ${slug} not found`);
        }

        const comments = await this.commentService.getCommentsByPostSlug(slug, { page: 1, limit: 5 });

        return {
            ...post,
            comments,
        };
    }

    private async getPosts(where: any, paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;

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

        return {
            data: posts,
            meta: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }

    async  getAllPostsByUserId(userId: number, paginationDto: PaginationDto){
        return this.getPosts({ userId }, paginationDto);
    }

    async getAllPosts(paginationDto: PaginationDto) {
        return this.getPosts({}, paginationDto);
    }

    async deletePost(id: number) {
        const post = await this.prisma.post.findUnique({ where: { id } });

        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        return this.prisma.post.delete({ where: { id } });
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
        }
        return this.getPosts(where, paginationDto);
    }
}

