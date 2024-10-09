import { RentalStatus } from '@prisma/client';
import {
  IsNotEmpty,
  IsArray,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { RentalStatusType } from 'src/utils/const-enum';

export class UpdateRentalDto {
  @IsDateString()
  @IsNotEmpty()
  dateFrom: Date;

  @IsDateString()
  @IsNotEmpty()
  dateTo: Date;

  @IsOptional()
  @IsBoolean({ message: 'Значение должно быть типа boolean ' })
  isDelivery: boolean | null;

  @IsEnum(RentalStatus)
  status: RentalStatusType;

  @IsArray()
  @IsNotEmpty()
  rentalProducts: { productId: number; quantity: number }[];
}
