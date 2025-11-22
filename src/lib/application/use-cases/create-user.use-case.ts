import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UserResponseDto } from '../dto/user/user-response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const userId = randomUUID();
    const user = new UserEntity(
      userId,
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );

    const savedUser = await this.userRepository.save(user);

    return this.toResponseDto(savedUser);
  }

  private toResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    };
  }
}

