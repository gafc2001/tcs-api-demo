import { ApiProperty } from '@nestjs/swagger';

export class QuoteItemResponseDto {
  @ApiProperty({
    description: 'Quote item unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productId: string;

  @ApiProperty({
    description: 'Quantity of products',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Price per unit',
    example: 5000.00,
  })
  price: number;
}

