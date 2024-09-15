import { IsNotEmpty, IsArray, IsDateString } from 'class-validator';

export class UpdateRentalDto {
  @IsDateString()
  @IsNotEmpty()
  dateFrom: Date;

  @IsDateString()
  @IsNotEmpty()
  dateTo: Date;

  @IsArray()
  @IsNotEmpty()
  rentalProducts: { productId: number; quantity: number }[];
}
