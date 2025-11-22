import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ProductEntity } from '../../domain/entities/product.entity';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { CreateProductDto } from '../dto/product/create-product.dto';
import { ProductResponseDto } from '../dto/product/product-response.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const productId = randomUUID();
    const product = new ProductEntity(
      productId,
      createProductDto.name,
      createProductDto.productType,
      createProductDto.description || '',
      createProductDto.price,
    );

    const savedProduct = await this.productRepository.save(product);

    return this.toResponseDto(savedProduct);
  }

  private toResponseDto(product: ProductEntity): ProductResponseDto {
    return {
      id: product.getId(),
      name: product.getName(),
      productType: product.getProductType(),
      description: product.getDescription(),
      price: product.getPrice(),
    };
  }
}

