import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [AuthModule],
  exports: [ProductsService],
})
export class ProductModule {}
