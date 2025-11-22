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
import { CreateQuoteDto } from '../../../../application/dto/quote/create-quote.dto';
import { QuoteResponseDto } from '../../../../application/dto/quote/quote-response.dto';
import { CreateQuoteUseCase } from '../../../../application/use-cases/create-quote.use-case';

@ApiTags('quotes')
@Controller('api/v1/quotes')
export class QuoteController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new quote' })
  @ApiBody({ type: CreateQuoteDto })
  @ApiResponse({
    status: 201,
    description: 'Quote successfully created',
    type: QuoteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid premium product amount or validation error',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer or product not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createQuoteDto: CreateQuoteDto): Promise<QuoteResponseDto> {
    return await this.createQuoteUseCase.execute(createQuoteDto);
  }
}

