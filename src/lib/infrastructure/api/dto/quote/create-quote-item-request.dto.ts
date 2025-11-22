import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateQuoteItemRequest {
  @ApiProperty({
    description: 'Product identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantity of products',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Price per unit',
    example: 5000.00,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;
}

