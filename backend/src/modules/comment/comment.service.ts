import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CommentService {
    constructor(
        private readonly prisma: PrismaService) {}

    async getCommentsByPostSlug(slug: string, paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        
        const post = await this.prisma.post.findUnique({ 
            where: { slug },
            select: {
                id: true
            }
        });

        if (!post) {
            throw new NotFoundException(`Post with slug ${slug} not found`);
        }

        const [comments, total] = await this.prisma.$transaction([
            this.prisma.comment.findMany({
              where: { postId: post.id, parentId: null },
              skip: (page - 1) * limit,
              take: limit,
              orderBy: { createdAt: 'desc' },
              include: {
                user: {
                  select: { id: true, username: true, profilePicture: true },
                },
                _count: {
                  select: { children: true },
                },
              },
            }),
            this.prisma.comment.count({
              where: { postId: post.id, parentId: null },
            }),
        ]);

        return {
            data: comments,
            meta: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            }
        };
    }

    async getReplies(id: number, paginationDto: PaginationDto) {
        const { page = 1, limit = 5 } = paginationDto;
        
        const [replies, total] = await this.prisma.$transaction([
            this.prisma.comment.findMany({
              where: { parentId: id },
              skip: (page - 1) * limit,
              take: limit,
              orderBy: { createdAt: 'asc' },
              include: {
                user: { select: { id: true, username: true, profilePicture: true } },
              },
            }),
            this.prisma.comment.count({ where: { parentId: id } }),
          ]);

        return {
            data: replies,
            meta: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            }
        };
    }

    async createComment(slug: string, createCommentDto: CreateCommentDto) {
        const post = await this.prisma.post.findUnique({ where: { slug }, select: { id: true }});

        if (!post) {
            throw new NotFoundException(`Post with slug ${slug} not found`);
        }

        const comment = await this.prisma.comment.create({ data: { ...createCommentDto, postId: post.id } });

        return comment;
    }

    async updateComment(id: number, updateCommentDto: UpdateCommentDto) {

        const comment = await this.prisma.comment.findUnique({ where: { id } });

        if (!comment) {
            throw new NotFoundException(`Comment with id ${id} not found`);
        }

        const updatedComment = await this.prisma.comment.update({ where: { id }, data: updateCommentDto });

        return updatedComment;
    }

    async deleteComment(id: number) {

        const comment = await this.prisma.comment.findUnique({ where: { id } });

        if (!comment) {
            throw new NotFoundException(`Comment with id ${id} not found`);
        }

        const deletedComment = await this.prisma.comment.delete({ where: { id } });

        return deletedComment;
    }
}
