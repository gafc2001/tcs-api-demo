import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserRequest {
  @ApiProperty({
    description: 'User full name',
    example: 'Gustavo Farfan',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'gustavo.farfan@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'APassword',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}

