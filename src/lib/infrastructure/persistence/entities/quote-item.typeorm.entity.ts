import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuoteTypeOrmEntity } from './quote.typeorm.entity';
import { ProductTypeOrmEntity } from './product.typeorm.entity';

@Entity('quote_items')
export class QuoteItemTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quoteId: string;

  @ManyToOne(() => QuoteTypeOrmEntity, (quote) => quote.quoteItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quoteId' })
  quote: QuoteTypeOrmEntity;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => ProductTypeOrmEntity, (product) => product.quoteItems)
  @JoinColumn({ name: 'productId' })
  product: ProductTypeOrmEntity;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
