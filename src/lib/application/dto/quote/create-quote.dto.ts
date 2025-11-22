import { CreateQuoteItemDto } from './create-quote-item.dto';

export class CreateQuoteDto {
  customerId: string;
  quoteItems: CreateQuoteItemDto[];
}

