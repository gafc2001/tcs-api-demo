import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeOrmEntity } from 'src/lib/infrastructure/persistence/entities/product.typeorm.entity';
import { QuoteItemTypeOrmEntity } from 'src/lib/infrastructure/persistence/entities/quote-item.typeorm.entity';
import { QuoteTypeOrmEntity } from 'src/lib/infrastructure/persistence/entities/quote.typeorm.entity';
import { UserTypeOrmEntity } from 'src/lib/infrastructure/persistence/entities/user.typeorm.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserTypeOrmEntity,
        ProductTypeOrmEntity,
        QuoteTypeOrmEntity,
        QuoteItemTypeOrmEntity,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class DatabaseModule {}
