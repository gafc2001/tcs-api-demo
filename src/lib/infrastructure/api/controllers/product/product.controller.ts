import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ProductResponseDto } from '../../../../application/dto/product/product-response.dto';
import { CreateProductUseCase } from '../../../../application/use-cases/create-product.use-case';
import { CreateProductRequest } from '../../dto/product/create-product-request.dto';
import { ProductMapper } from '../../mappers/product.mapper';

@ApiTags('products')
@Controller('api/v1/products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductRequest })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(
    @Body() createProductRequest: CreateProductRequest,
  ): Promise<ProductResponseDto> {
    const createProductDto = ProductMapper.toCreateProductDto(
      createProductRequest,
    );
    return await this.createProductUseCase.execute(createProductDto);
  }
}

