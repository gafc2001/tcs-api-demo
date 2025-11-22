import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  MinLength,
} from 'class-validator';
import { PRODUCT_TYPE } from '../../../../domain/enums/product-type.enum';
import type { ProductType } from '../../../../domain/enums/product-type.enum';

export class CreateProductRequest {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Product',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Product type',
    enum: PRODUCT_TYPE,
    example: PRODUCT_TYPE.PREMIUM,
  })
  @IsEnum(PRODUCT_TYPE)
  productType: ProductType;

  @ApiProperty({
    description: 'Product description',
    example: 'A premium quality product',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 10000.50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;
}

