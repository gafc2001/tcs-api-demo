import { CreateProductRequest } from '../dto/product/create-product-request.dto';
import { CreateProductDto } from '../../../application/dto/product/create-product.dto';

export class ProductMapper {
  static toCreateProductDto(
    request: CreateProductRequest,
  ): CreateProductDto {
    return {
      name: request.name,
      productType: request.productType,
      description: request.description,
      price: request.price,
    };
  }
}

