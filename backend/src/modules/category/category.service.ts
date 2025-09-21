import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllCategories() {
        const categories = await this.prisma.category.findMany();

        if (!categories) {
            throw new NotFoundException('Categories not found');
        }

        return categories;
    }

    async getCategoryById(id: number) {
        const category = await this.prisma.category.findUnique({ where: { id } });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async getCategoryBySlug(slug: string) {
        const category = await this.prisma.category.findUnique({ where: { slug } });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }
    
    async createCategory(createCategoryDto: CreateCategoryDto) {
        const { name, slug } = createCategoryDto;

        let categorySlug = slug || slugify(name, {
            lower: true,
            remove: /[*+~.()]/g,
        });

        const category = await this.prisma.category.create({ data: { name, slug: categorySlug } });

        if (!category) {
            throw new BadRequestException('Category not created');
        }

        return category;
    }

    async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {

        const category = await this.getCategoryById(id);

        if(!category) {
            throw new NotFoundException('Category not found');
        }

        const updatedCategory = await this.prisma.category.update({ where: { id }, data: updateCategoryDto });

        if (!updatedCategory) {
            throw new BadRequestException('Category not updated');
        }

        return updatedCategory;
    }

    async deleteCategory(id: number) {
        const category = await this.getCategoryById(id);

        if(!category) {
            throw new NotFoundException('Category not found');
        }

        const deletedCategory = await this.prisma.category.delete({ where: { id } });

        if (!deletedCategory) {
            throw new BadRequestException('Category not deleted');
        }

        return deletedCategory;
    }
}
