import { Module } from '@nestjs/common';
import { QuoteController } from './controllers/quote/quote.controller';
import { CreateQuoteUseCase } from '../../application/use-cases/create-quote.use-case';
import { PersistenceModule } from '../persistence/persistence.module';
import { ExternalModule } from '../external/external.module';

@Module({
  imports: [PersistenceModule, ExternalModule],
  controllers: [QuoteController],
  providers: [CreateQuoteUseCase],
})
export class QuoteModule {}