import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDiscordDto {
  @ApiProperty({
    description: 'User email address from Discord',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Must provide a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Discord user ID',
    example: '123456789012345678',
  })
  @IsString({ message: 'Discord ID must be a string' })
  @IsNotEmpty({ message: 'Discord ID is required' })
  discordId: string;

  @ApiProperty({
    description: 'Discord username',
    example: 'johndoe',
    maxLength: 32,
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MaxLength(32, {
    message: 'Username cannot be longer than 32 characters',
  })
  username: string;

  @ApiProperty({
    description: 'Discord OAuth access token',
    example: 'discord_access_token_here',
  })
  @IsString({ message: 'Access token must be a string' })
  @IsNotEmpty({ message: 'Access token is required' })
  access_token: string;

  @ApiProperty({
    description: 'Discord OAuth refresh token',
    example: 'discord_refresh_token_here',
    required: false,
  })
  @IsString({ message: 'Refresh token must be a string' })
  @IsOptional()
  refresh_token?: string;

  @ApiProperty({
    description: 'Discord avatar URL',
    example: 'https://cdn.discordapp.com/avatars/123456789012345678/avatar.png',
    required: false,
  })
  @IsString({ message: 'Avatar must be a string' })
  @IsOptional()
  avatar?: string;
}
