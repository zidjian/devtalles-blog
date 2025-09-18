import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoryDto {
    
    @ApiProperty({ example: 'Category Name' })
    @IsString()
    name: string;
    
    @ApiProperty({ example: 'category-slug' })
    @IsString()
    slug: string;
}