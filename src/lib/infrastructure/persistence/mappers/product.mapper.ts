import { ProductEntity } from '../../../domain/entities/product.entity';
import { ProductTypeOrmEntity } from '../entities/product.typeorm.entity';

export class ProductMapper {
  static toDomain(entity: ProductTypeOrmEntity): ProductEntity {
    return new ProductEntity(
      entity.id,
      entity.name,
      entity.productType,
      entity.description,
      Number(entity.price),
    );
  }

  static toTypeOrm(domain: ProductEntity): Partial<ProductTypeOrmEntity> {
    return {
      id: domain.getId(),
      name: domain.getName(),
      productType: domain.getProductType(),
      description: domain.getDescription(),
      price: domain.getPrice(),
    };
  }
}
