import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [RentalService, PrismaService],
  controllers: [RentalController],
  imports: [AuthModule],
})
export class RentalModule {}
