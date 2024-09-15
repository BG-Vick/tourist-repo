import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ParseIntPipe } from 'src/pipes/parce-int.pipe';
import { UpdateProductDto } from './dto/update-product-dto';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  createProduct(@Body() dto: ProductDto) {
    return this.productService.createProduct(dto);
  }

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  deleteProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProductById(id);
  }
}
