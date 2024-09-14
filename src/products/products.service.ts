import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomConflictException } from 'src/exceptions/conflict.exceptions';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(dto: ProductDto) {
    const post = await this.prismaService.product.create({
      data: {
        ...dto,
      },
    });
    return post;
  }

  async getAllProducts() {
    const products = await this.prismaService.product.findMany();
    return products;
  }

  async getProductById(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      throw new HttpException(
        `Не удалось найти продукт с таким идентификатором: ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return product;
  }

  async updateProduct(id: number, dto: ProductDto) {
    const { quantity } = dto;
    if (quantity < 0) {
      throw new BadRequestException(
        `Поле quantity должно быть положительным целым числом вы передаете: ${quantity}`,
      );
    }
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }

    return this.prismaService.product.update({
      where: { id },
      data: { ...dto },
    });
  }

  async deleteProductById(id: number) {
    const rentalProducts = await this.prismaService.rentalProduct.findMany({
      where: { productId: id },
    });
    if (rentalProducts.length) {
      const rentalProductIds = rentalProducts.map((product) => {
        return {
          rentalId: product.rentalId,
        };
      });
      throw new CustomConflictException(
        `Вы не можете удалить продукт с id ${id}, так как к нему привязаны заказы.`,
        {
          orderIds: rentalProductIds,
        },
      );
    }
    const candidateToDelete = await this.prismaService.product.findUnique({
      where: { id },
    });
    if (!candidateToDelete) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
    const deletedProduct = await this.prismaService.product.delete({
      where: { id },
    });

    return deletedProduct;
  }
}
