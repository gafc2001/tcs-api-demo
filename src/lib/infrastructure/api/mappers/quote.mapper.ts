import { CreateQuoteRequest } from '../dto/quote/create-quote-request.dto';
import { CreateQuoteItemRequest } from '../dto/quote/create-quote-item-request.dto';
import { CreateQuoteDto } from '../../../application/dto/quote/create-quote.dto';
import { CreateQuoteItemDto } from '../../../application/dto/quote/create-quote-item.dto';

export class QuoteMapper {
  static toCreateQuoteDto(
    request: CreateQuoteRequest,
  ): CreateQuoteDto {
    return {
      customerId: request.customerId,
      quoteItems: request.quoteItems.map((item) =>
        this.toCreateQuoteItemDto(item),
      ),
    };
  }

  static toCreateQuoteItemDto(
    request: CreateQuoteItemRequest,
  ): CreateQuoteItemDto {
    return {
      productId: request.productId,
      quantity: request.quantity,
      price: request.price,
    };
  }
}

