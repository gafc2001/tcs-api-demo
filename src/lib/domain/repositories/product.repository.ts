import { ProductEntity } from '../entities/product.entity';

export interface ProductRepository {
  findById(id: string): Promise<ProductEntity | null>;
  save(product: ProductEntity): Promise<ProductEntity>;
}
