import { QuoteAggregate } from '../../../domain/aggregate/quote.aggregate';
import { QuoteTypeOrmEntity } from '../entities/quote.typeorm.entity';
import { QuoteItemMapper } from './quote-item.mapper';
import { QuoteItemTypeOrmEntity } from '../entities/quote-item.typeorm.entity';

export class QuoteMapper {
  static toDomain(entity: QuoteTypeOrmEntity): QuoteAggregate {
    const quote = new QuoteAggregate(
      entity.id,
      entity.customerId,
      Number(entity.totalAmount),
      entity.status,
    );

    if (entity.quoteItems && entity.quoteItems.length > 0) {
      const quoteItems = entity.quoteItems.map((item) =>
        QuoteItemMapper.toDomain(item),
      );
      quote.restoreItems(quoteItems);
    }

    return quote;
  }

  static toTypeOrm(domain: QuoteAggregate): Partial<QuoteTypeOrmEntity> {
    const quoteItems = domain.getQuoteItems();
    const quoteItemsTypeOrm = quoteItems
      ? quoteItems.map(
          (item) => QuoteItemMapper.toTypeOrm(item) as QuoteItemTypeOrmEntity,
        )
      : undefined;

    return {
      id: domain.getId(),
      customerId: domain.getCustomerId(),
      totalAmount: domain.getTotalAmount(),
      status: domain.getStatus(),
      quoteItems: quoteItemsTypeOrm,
    };
  }
}
