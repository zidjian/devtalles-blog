import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
    @ApiProperty({ example: 1, required: false })
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;
    
    @ApiProperty({ example: 10, required: false })
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;
}