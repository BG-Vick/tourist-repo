import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/products.module';
import { RentalModule } from './rental/rental.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProductModule,
    RentalModule,
    ProfileModule,
  ],
})
export class AppModule {}
