import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteRentalDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  rentalId: number;
}
