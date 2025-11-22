import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateProductDto } from '../../../../application/dto/product/create-product.dto';
import { ProductResponseDto } from '../../../../application/dto/product/product-response.dto';
import { CreateProductUseCase } from '../../../../application/use-cases/create-product.use-case';

@Controller('api/v1/products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return await this.createProductUseCase.execute(createProductDto);
  }
}

