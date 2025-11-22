import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'Gustavo Farfan',
  })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'gustavo.farfan@gmail.com',
  })
  email: string;
}

