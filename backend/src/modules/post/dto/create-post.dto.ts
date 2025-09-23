import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreatePostDto {
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
  @ArrayUnique()
  @Min(1, { each: true })
  @IsNumber({}, { each: true })
  @Transform(({ value }) => {
    // Handle both JSON string and array formats
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return Array.isArray(value) ? value : [];
  })
  @Type(() => Number)
  categoryIds: number[];
}
