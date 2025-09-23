import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  ProfileResponseDto,
} from './dto/auth.dto';
import { RegisterDiscordDto } from './dto/register-discord.dto';
import { Auth } from './decorators/auth.decorator';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['Must provide a valid email', 'Password is required'],
        error: 'Bad Request',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'User registration',
    description: 'Create a new user account',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'User with this email or username already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Username must be at least 3 characters long',
          'Must provide a valid email',
        ],
        error: 'Bad Request',
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get authenticated user profile information',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @Auth()
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.authService.findUserById(req.user.id);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate a new access token using the current valid token',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @Auth()
  async refreshToken(@Request() req: AuthenticatedRequest) {
    return this.authService.refreshToken(req.user.id);
  }

  @Get('validate')
  @ApiOperation({
    summary: 'Validate token',
    description:
      'Check if the current token is valid and get basic user information',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    schema: {
      example: {
        valid: true,
        user: {
          id: 1,
          username: 'johndoe',
          email: 'john@example.com',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token is invalid or expired',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @Auth()
  validateToken(@Request() req: AuthenticatedRequest) {
    return {
      valid: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
      },
    };
  }

  @Post('register-discord')
  @ApiOperation({
    summary: 'Register/Login with Discord',
    description:
      'Register or authenticate user with Discord OAuth data from NextAuth',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        discordId: { type: 'string', example: '123456789012345678' },
        username: { type: 'string', example: 'johndoe' },
        access_token: { type: 'string', example: 'discord_access_token' },
        refresh_token: { type: 'string', example: 'discord_refresh_token' },
        avatar: {
          type: 'string',
          example: 'https://cdn.discordapp.com/avatars/...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully registered/authenticated with Discord',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 201,
    description: 'New user created with Discord',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Discord data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid Discord data provided',
        error: 'Bad Request',
      },
    },
  })
  async registerDiscord(@Body() discordData: RegisterDiscordDto) {
    return await this.authService.registerDiscordUser(discordData);
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  @ApiOperation({
    summary: 'Login with Discord',
    description: 'Redirects to Discord OAuth for authentication',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Discord OAuth',
  })
  async discordAuth() {
    // This endpoint will redirect to Discord OAuth
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  @ApiOperation({
    summary: 'Discord OAuth callback',
    description:
      'Handles the callback from Discord OAuth and returns JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated with Discord',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Discord authentication failed',
    schema: {
      example: {
        statusCode: 401,
        message: 'Discord authentication failed',
        error: 'Unauthorized',
      },
    },
  })
  async discordCallback(@Request() req: AuthenticatedRequest) {
    return await this.authService.loginWithDiscord(req.user);
  }
}
