import { ProductType } from '../../../domain/enums/product-type.enum';

export class CreateProductDto {
  name: string;
  productType: ProductType;
  description?: string;
  price: number;
}

