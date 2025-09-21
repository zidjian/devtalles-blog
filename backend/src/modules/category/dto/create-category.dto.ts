import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    
    @ApiProperty({ example: 'Category Name' })
    @IsString()
    name: string;
    
    @ApiProperty({ example: 'category-slug' })
    @IsString()
    @IsOptional()
    slug?: string;
}