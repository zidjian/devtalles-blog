import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreatePostDto {
    
    @ApiProperty({ example: '1' })
    @IsNumber()
    userId: number;
    
    @ApiProperty({ example: 'Post Title' })
    @IsString()
    title: string;  
    
    @ApiProperty({ example: 'post-slug', required: false })
    @IsString()
    @IsOptional()
    slug?: string;
    
    @ApiProperty({ example: 'Post Content' })
    @IsString()
    content: string;

    @ApiProperty({ example: '[1, 2, 3]' })
    @IsArray()
    @Min(1, { each: true })
    @IsNumber({}, { each: true })
    @Type(() => Number)
    categoryIds: number[];
}
