import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { ROLES } from 'src/utils/const-enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductsService } from 'src/products/products.service';
@Injectable()
export class RentalService {
  constructor(
    private readonly prisma: PrismaService,
    private productServise: ProductsService,
  ) {}

  async createRental(createRentalDto: CreateRentalDto, currentUser) {
    if (
      currentUser.id !== createRentalDto.userId &&
      currentUser.role !== ROLES.admin
    ) {
      throw new UnauthorizedException('Вы не можете совершить это действие');
    }
    const { userId, rentalProducts } = createRentalDto;
    const dateFrom = new Date(createRentalDto.dateFrom);
    const dateTo = new Date(createRentalDto.dateTo);

    const currentUsersRental = await this.prisma.rental.findFirst({
      where: { userId },
    });

    if (currentUsersRental) {
      throw new HttpException(
        'У данного пользователя уже есть заказ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const rentalTransaction = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
      }
      for (const product of rentalProducts) {
        const { productId, quantity } = product;
        if (!Number.isInteger(productId)) {
          throw new HttpException(
            'productId должно быть числом ',
            HttpStatus.BAD_REQUEST,
          );
        }
        const productInDb = await prisma.product.findUnique({
          where: { id: productId },
        });
        if (!productInDb) {
          throw new NotFoundException(`Продукт с ID ${productId} не найден`);
        }
        if (!Number.isInteger(quantity) || quantity < 0) {
          throw new HttpException(
            'quantity должно быть целым положительным числом ',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (productInDb.quantity < quantity) {
          throw new BadRequestException(
            `Недостаточно товаров с ID ${productId}. Доступно: ${productInDb.quantity}, вы запрашиваете: ${quantity}`,
          );
        }

        await prisma.product.update({
          where: { id: productId },
          data: { quantity: productInDb.quantity - quantity },
        });
      }
      const rental = await prisma.rental.create({
        data: {
          userId,
          dateFrom,
          dateTo,
        },
      });
      const rentalProductsData = rentalProducts.map((product) => ({
        rentalId: rental.id,
        productId: product.productId,
        quantity: product.quantity,
      }));
      await prisma.rentalProduct.createMany({
        data: rentalProductsData,
      });
      return rental;
    });
    return rentalTransaction;
  }

  async getRentalById(id: number, currentUser) {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
      include: { rentalProducts: true },
    });
    if (!rental) {
      throw new NotFoundException(`Аренда с ID ${id} не найдена`);
    }
    if (currentUser.id !== rental?.userId && currentUser.role !== ROLES.admin) {
      throw new UnauthorizedException('Вы не можете совершить это действие');
    }
    if (!rental) {
      throw new NotFoundException(`Аренда с ID ${id} не найдена`);
    }
    return rental;
  }

  async getRentalByUserId(id: number, currentUser) {
    if (currentUser.id !== id && currentUser.role !== ROLES.admin) {
      throw new UnauthorizedException('Вы не можете совершить это действие');
    }
    const rental = await this.prisma.rental.findMany({
      where: { userId: id },
      include: { rentalProducts: true },
    });

    if (!rental) {
      throw new NotFoundException(`Аренда с ID ${id} не найдена`);
    }
    if (rental) {
      const rentalProductArr = rental[0].rentalProducts;
      const updatedRental = {
        id: rental[0].id,
        userId: rental[0].userId,
        dateFrom: rental[0].dateFrom,
        dateTo: rental[0].dateTo,
        isDelivery: rental[0].isDelivery,
        status: rental[0].status,
        createdAt: rental[0].createdAt,
        totalPrice: 0,
        rentalProducts: [],
      };
      for (const oneRental of rentalProductArr) {
        const currentProduct = await this.productServise.getProductById(
          oneRental.productId,
        );

        if (currentProduct) {
          updatedRental.rentalProducts.push({
            id: currentProduct.id,
            title: currentProduct.title,
            description: currentProduct.description,
            category: currentProduct.category,
            price: currentProduct.price,
            image: currentProduct.image,
            quantity: oneRental.quantity,
          });
          updatedRental.totalPrice += currentProduct.price * oneRental.quantity;
        }
      }
      return updatedRental;
    }
  }

  async getAllRentals() {
    const allRentals = this.prisma.rental.findMany();
    if (!allRentals) {
      throw new NotFoundException('Аренды не найдены');
    }
    return allRentals;
  }

  async deleteRentalById(id: number, currentUser) {
    const deleteTransaction = await this.prisma.$transaction(async (prisma) => {
      const rental = await prisma.rental.findUnique({
        where: { id },
        include: { rentalProducts: true },
      });
      if (!rental) {
        throw new NotFoundException(`Аренда с ID ${id} не найдена`);
      }
      if (
        currentUser.id !== rental.userId &&
        currentUser.role !== ROLES.admin
      ) {
        throw new UnauthorizedException('Вы не можете совершить это действие');
      }
      for (const rentalProduct of rental.rentalProducts) {
        const { productId, quantity } = rentalProduct;
        const productInDb = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!productInDb) {
          throw new NotFoundException(`Продукт с ID ${productId} не найден`);
        }

        await prisma.product.update({
          where: { id: productId },
          data: { quantity: productInDb.quantity + quantity },
        });
      }

      await prisma.rentalProduct.deleteMany({
        where: { rentalId: rental.id },
      });

      const deletedRental = await prisma.rental.delete({
        where: { id: rental.id },
      });

      return deletedRental;
    });
    return deleteTransaction;
  }

  async updateRentalById(id: number, dto: UpdateRentalDto, currentUser) {
    // сначала находим rental c связанными продуктами
    const dateFrom = new Date(dto.dateFrom);
    const dateTo = new Date(dto.dateTo);
    const updateTransaction = await this.prisma.$transaction(async (prisma) => {
      const rental = await prisma.rental.findUnique({
        where: { id },
        include: { rentalProducts: true },
      });
      if (!rental) {
        throw new NotFoundException(`Аренда с ID ${id} не найдена`);
      }
      if (
        currentUser.id !== rental.userId &&
        currentUser.role !== ROLES.admin
      ) {
        throw new UnauthorizedException('Вы не можете совершить это действие');
      }
      //  Затем работаем с rentalProduct, то есть откатываем все
      //  изменения назад к тому, что было если бы этого заказа не было
      //  то есть возвращаем продуктам quantity

      for (const rentalProduct of rental.rentalProducts) {
        const { productId, quantity } = rentalProduct;
        const productInDb = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!productInDb) {
          throw new InternalServerErrorException(
            `Произошла неизвестная ошибка при попытке обновить продукт с ID: ${productId}`,
          );
        }

        await prisma.product.update({
          where: { id: productId },
          data: { quantity: productInDb.quantity + quantity },
        });
      }
      // Теперь нужно cбросить rentalProduct
      await prisma.rentalProduct.deleteMany({
        where: { rentalId: rental.id },
      });

      // Затем снова добавляем продукты в таблицу rentalProduct уже из dto
      for (const product of dto.rentalProducts) {
        const { productId, quantity } = product;
        if (!Number.isInteger(productId)) {
          throw new HttpException(
            'productId должно быть числом ',
            HttpStatus.BAD_REQUEST,
          );
        }
        const productInDb = await prisma.product.findUnique({
          where: { id: productId },
        });
        if (!productInDb) {
          throw new NotFoundException(`Продукт с ID ${productId} не найден`);
        }
        if (!Number.isInteger(quantity) || quantity < 0) {
          throw new HttpException(
            'quantity должно быть целым положительным числом ',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (productInDb.quantity < quantity) {
          throw new BadRequestException(
            `Недостаточно товаров с ID ${productId}. Доступно: ${productInDb.quantity}, вы запрашиваете: ${quantity}`,
          );
        }

        await prisma.product.update({
          where: { id: productId },
          data: { quantity: productInDb.quantity - quantity },
        });
      }
      const updatedRental = await prisma.rental.update({
        where: {
          id: rental.id,
        },
        data: {
          dateFrom: dateFrom,
          dateTo: dateTo,
          isDelivery: dto.isDelivery,
          status: dto.status,
        },
      });
      const rentalProductsData = dto.rentalProducts.map((product) => ({
        rentalId: updatedRental.id,
        productId: product.productId,
        quantity: product.quantity,
      }));
      await prisma.rentalProduct.createMany({
        data: rentalProductsData,
      });
      const updatedRentalIncludeRentalProducts = await prisma.rental.findUnique(
        {
          where: { id: updatedRental.id },
          include: { rentalProducts: true },
        },
      );
      return updatedRentalIncludeRentalProducts;
    });
    return updateTransaction;
  }

  async findOldRental() {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() - 3);

    const oldRental = await this.prisma.rental.findMany({
      where: {
        status: 'IN_PROGRESS',
        createdAt: {
          lt: expirationTime,
        },
      },
    });

    return oldRental;
  }

  async deleteExpiredRentals() {
    const oldRentals = await this.findOldRental();
    const currentUser = {
      role: ROLES.admin,
      id: null,
    };
    if (oldRentals?.length) {
      for (const rental of oldRentals) {
        this.deleteRentalById(rental.id, currentUser);
      }
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    await this.deleteExpiredRentals();
  }
}
