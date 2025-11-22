import { ApiProperty } from '@nestjs/swagger';
import { PRODUCT_TYPE, type ProductType } from '../../../domain/enums/product-type.enum';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Premium Product',
  })
  name: string;

  @ApiProperty({
    description: 'Product type',
    enum: PRODUCT_TYPE,
    example: PRODUCT_TYPE.PREMIUM,
  })
  productType: ProductType;

  @ApiProperty({
    description: 'Product description',
    example: 'A premium quality product',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 10000.50,
  })
  price: number;
}

