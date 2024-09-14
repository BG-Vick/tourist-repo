import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, MinLength } from 'class-validator';

export class BanUserDto {
  @Transform(({ value }) => Number(value))
  @IsInt({ message: ' userId - должно быть числом' })
  readonly userId: number;

  @MinLength(4)
  @IsNotEmpty({ message: 'Не может быть пустым' })
  readonly banReason: string;
}
