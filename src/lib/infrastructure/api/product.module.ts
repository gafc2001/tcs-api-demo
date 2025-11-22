import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product/product.controller';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [ProductController],
  providers: [CreateProductUseCase],
})
export class ProductModule {}

