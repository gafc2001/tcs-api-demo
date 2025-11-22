import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from '../../../../application/dto/user/create-user.dto';
import { UserResponseDto } from '../../../../application/dto/user/user-response.dto';
import { CreateUserUseCase } from '../../../../application/use-cases/create-user.use-case';

@ApiTags('users')
@Controller('api/v1/users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.createUserUseCase.execute(createUserDto);
  }
}

