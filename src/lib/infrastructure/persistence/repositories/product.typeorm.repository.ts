import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductEntity } from '../../../domain/entities/product.entity';
import { ProductTypeOrmEntity } from '../entities/product.typeorm.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductTypeOrmEntity)
    private readonly repository: Repository<ProductTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<ProductEntity | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async save(product: ProductEntity): Promise<ProductEntity> {
    const entityData = ProductMapper.toTypeOrm(product);
    const entity = this.repository.create(entityData);
    const savedEntity = await this.repository.save(entity);
    return ProductMapper.toDomain(savedEntity);
  }
}
