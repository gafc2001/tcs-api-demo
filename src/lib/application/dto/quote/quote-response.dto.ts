import { QuoteItemResponseDto } from './quote-item-response.dto';

export class QuoteResponseDto {
  id: string;
  customerId: string;
  totalAmount: number;
  status: boolean;
  items: QuoteItemResponseDto[];
}

