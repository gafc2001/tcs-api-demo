import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserTypeOrmEntity } from './user.typeorm.entity';
import { QuoteItemTypeOrmEntity } from './quote-item.typeorm.entity';

@Entity('quotes')
export class QuoteTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @ManyToOne(() => UserTypeOrmEntity, (user) => user.quotes)
  @JoinColumn({ name: 'customerId' })
  customer: UserTypeOrmEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @OneToMany(() => QuoteItemTypeOrmEntity, (quoteItem) => quoteItem.quote, {
    cascade: true,
  })
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
