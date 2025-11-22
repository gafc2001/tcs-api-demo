import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './entities/user.typeorm.entity';
import { ProductTypeOrmEntity } from './entities/product.typeorm.entity';
import { QuoteTypeOrmEntity } from './entities/quote.typeorm.entity';
import { QuoteItemTypeOrmEntity } from './entities/quote-item.typeorm.entity';
import { UserTypeOrmRepository } from './repositories/user.typeorm.repository';
import { ProductTypeOrmRepository } from './repositories/product.typeorm.repository';
import { QuoteTypeOrmRepository } from './repositories/quote.typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      ProductTypeOrmEntity,
      QuoteTypeOrmEntity,
      QuoteItemTypeOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserTypeOrmRepository,
    },
    {
      provide: 'ProductRepository',
      useClass: ProductTypeOrmRepository,
    },
    {
      provide: 'QuoteRepository',
      useClass: QuoteTypeOrmRepository,
    },
  ],
  exports: ['UserRepository', 'ProductRepository', 'QuoteRepository'],
})
export class PersistenceModule {}
