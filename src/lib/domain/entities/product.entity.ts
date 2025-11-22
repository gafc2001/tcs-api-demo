import { ProductType } from '../enums/product-type.enum';

export class ProductEntity {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _productType: ProductType,
    private _description: string,
    private _price: number,
  ) {}

  getName(): string {
    return this._name;
  }

  getProductType(): ProductType {
    return this._productType;
  }

  getPrice(): number {
    return this._price;
  }

  getDescription(): string {
    return this._description;
  }

  getId(): string {
    return this._id;
  }
}
