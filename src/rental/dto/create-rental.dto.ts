import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateRentalDto {
  @Transform(({ value }) => Math.abs(parseInt(value, 10)))
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsDateString()
  @IsNotEmpty()
  dateFrom: Date;

  @IsDateString()
  @IsNotEmpty()
  dateTo: Date;

  @IsOptional()
  @IsBoolean()
  isDelivery: boolean | null;

  @IsArray()
  @IsNotEmpty()
  rentalProducts: { productId: number; quantity: number }[];
}
