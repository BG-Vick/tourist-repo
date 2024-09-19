import {
  IsNotEmpty,
  IsArray,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

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

  @IsArray()
  @IsNotEmpty()
  rentalProducts: { productId: number; quantity: number }[];
}
