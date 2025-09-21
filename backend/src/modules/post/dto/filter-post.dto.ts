import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class FilterPostDto extends PaginationDto {

  @ApiPropertyOptional({example: 'title'})
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({example: '1'})
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;
}
