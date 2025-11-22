export class QuoteEntity {
  constructor(
    protected readonly _id: string,
    protected _customerId: string,
    protected _totalAmount: number,
    protected _status: boolean,
  ) {}

  getId(): string {
    return this._id;
  }

  getTotalAmount(): number {
    return this._totalAmount;
  }

  getStatus(): boolean {
    return this._status;
  }

  getCustomerId(): string {
    return this._customerId;
  }
}
