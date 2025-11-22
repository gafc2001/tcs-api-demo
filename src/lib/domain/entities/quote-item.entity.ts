export class QuoteItemEntity {
  constructor(
    private readonly _id: string,
    private _quoteId: string,
    private _productId: string,
    private _quantity: number,
    private _price: number,
  ) {}

  getPrice(): number {
    return this._price;
  }

  getQuantity(): number {
    return this._quantity;
  }

  getId(): string {
    return this._id;
  }

  getQuoteId(): string {
    return this._quoteId;
  }

  getProductId(): string {
    return this._productId;
  }
}
