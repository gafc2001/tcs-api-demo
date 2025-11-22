import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ProductTypeOrmEntity } from 'src/lib/infrastructure/persistence/entities/product.typeorm.entity';
import { QuoteItemTypeOrmEntity } from 'src/lib/infrastructure/persistence/entities/quote-item.typeorm.entity';
import { QuoteTypeOrmEntity } from 'src/lib/infrastructure/persistence/entities/quote.typeorm.entity';
import { UserTypeOrmEntity } from 'src/lib/infrastructure/persistence/entities/user.typeorm.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          UserTypeOrmEntity,
          ProductTypeOrmEntity,
          QuoteTypeOrmEntity,
          QuoteItemTypeOrmEntity,
        ],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
