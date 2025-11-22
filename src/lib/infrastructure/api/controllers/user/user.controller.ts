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
import { UserResponseDto } from '../../../../application/dto/user/user-response.dto';
import { CreateUserUseCase } from '../../../../application/use-cases/create-user.use-case';
import { CreateUserRequest } from '../../dto/user/create-user-request.dto';
import { UserMapper } from '../../mappers/user.mapper';

@ApiTags('users')
@Controller('api/v1/users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserRequest })
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
  async create(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<UserResponseDto> {
    const createUserDto = UserMapper.toCreateUserDto(createUserRequest);
    return await this.createUserUseCase.execute(createUserDto);
  }
}

