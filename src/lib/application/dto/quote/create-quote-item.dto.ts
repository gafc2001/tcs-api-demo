import { ApiProperty } from '@nestjs/swagger';

export class CreateQuoteItemDto {
  @ApiProperty({
    description: 'Product identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productId: string;

  @ApiProperty({
    description: 'Quantity of products',
    example: 2,
    minimum: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'Price per unit',
    example: 5000.00,
    minimum: 0,
  })
  price: number;
}

