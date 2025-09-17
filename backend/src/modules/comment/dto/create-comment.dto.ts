import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    
    @ApiProperty({ example: 'User ID' })
    @IsNumber()
    userId: number;
    
    @ApiProperty({ example: 'Parent ID' })
    @IsNumber()
    @IsOptional()
    parentId?: number;
    
    @ApiProperty({ example: 'Comment Content' })
    @IsString()
    content: string;
}
