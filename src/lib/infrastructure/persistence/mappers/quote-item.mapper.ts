import { QuoteItemEntity } from '../../../domain/entities/quote-item.entity';
import { QuoteItemTypeOrmEntity } from '../entities/quote-item.typeorm.entity';

export class QuoteItemMapper {
  static toDomain(entity: QuoteItemTypeOrmEntity): QuoteItemEntity {
    return new QuoteItemEntity(
      entity.id,
      entity.quoteId,
      entity.productId,
      entity.quantity,
      Number(entity.price),
    );
  }

  static toTypeOrm(domain: QuoteItemEntity): Partial<QuoteItemTypeOrmEntity> {
    return {
      id: domain.getId(),
      quoteId: domain.getQuoteId(),
      productId: domain.getProductId(),
      quantity: domain.getQuantity(),
      price: domain.getPrice(),
    };
  }
}
