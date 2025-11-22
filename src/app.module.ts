import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { QuoteModule } from './lib/infrastructure/api/quote.module';
import { ProductModule } from './lib/infrastructure/api/product.module';
import { UserModule } from './lib/infrastructure/api/user.module';

@Module({
  imports: [DatabaseModule, ConfigModule, QuoteModule, ProductModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
