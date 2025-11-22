import { QuoteAggregate } from '../aggregate/quote.aggregate';

export interface QuoteRepository {
  findById(id: string): Promise<QuoteAggregate | null>;
  save(quote: QuoteAggregate): Promise<QuoteAggregate>;
}
