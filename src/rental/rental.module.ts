import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductModule } from 'src/products/products.module';

@Module({
  providers: [RentalService, PrismaService],
  controllers: [RentalController],
  imports: [AuthModule, ScheduleModule.forRoot(), ProductModule],
})
export class RentalModule {}
