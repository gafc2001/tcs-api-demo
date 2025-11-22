import { ProductEntity } from '../entities/product.entity';
import { QuoteItemEntity } from '../entities/quote-item.entity';
import { QuoteEntity } from '../entities/quote.entity';
import { UserEntity } from '../entities/user.entity';
import { PRODUCT_TYPE } from '../enums/product-type.enum';
import { InvalidPremiumProductAmountException } from '../exceptions/InvalidPremiumProductAmountException';

export class QuoteAggregate extends QuoteEntity {
  private _quoteItems: QuoteItemEntity[] = [];
  constructor(id: string, customerId: string, amount: number, status: boolean) {
    super(id, customerId, amount, status);
  }

  assignUser(user: UserEntity): void {
    this._customerId = user.getId();
  }

  addItem(item: QuoteItemEntity, product: ProductEntity): void {
    const amount = item.getPrice() * item.getQuantity();
    if (product.getProductType() === PRODUCT_TYPE.PREMIUM && amount < 5000) {
      throw new InvalidPremiumProductAmountException();
    }
    this._quoteItems.push(item);
    this._totalAmount += amount;
  }

  getTotalAmount(): number {
    return this._totalAmount;
  }

  getQuoteItems(): QuoteItemEntity[] {
    return this._quoteItems;
  }

  restoreItems(items: QuoteItemEntity[]): void {
    this._quoteItems = items;
  }
}
