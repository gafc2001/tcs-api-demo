import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../../../../application/dto/user/create-user.dto';
import { UserResponseDto } from '../../../../application/dto/user/user-response.dto';
import { CreateUserUseCase } from '../../../../application/use-cases/create-user.use-case';

@Controller('api/v1/users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.createUserUseCase.execute(createUserDto);
  }
}

