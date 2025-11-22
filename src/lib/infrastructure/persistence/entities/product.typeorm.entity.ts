import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { QuoteItemTypeOrmEntity } from './quote-item.typeorm.entity';
import { PRODUCT_TYPE } from '../../../domain/enums/product-type.enum';
import type { ProductType } from '../../../domain/enums/product-type.enum';

@Entity('products')
export class ProductTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: [PRODUCT_TYPE.PREMIUM, PRODUCT_TYPE.BASIC] })
  productType: ProductType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => QuoteItemTypeOrmEntity, (quoteItem) => quoteItem.product)
  quoteItems: QuoteItemTypeOrmEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
