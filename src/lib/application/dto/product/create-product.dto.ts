import { ApiProperty } from '@nestjs/swagger';
import { PRODUCT_TYPE } from '../../../domain/enums/product-type.enum';
import type { ProductType } from '../../../domain/enums/product-type.enum';

export class CreateProductDto {
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
    minimum: 0,
  })
  price: number;
}

