import { IsInt, IsString, MinLength } from 'class-validator';

export class UpdateProductDto {
  @MinLength(1, { message: 'Не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string;

  @IsString({ message: 'Должно быть строкой' })
  readonly category: string;

  @MinLength(1, { message: 'Не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly image: string;

  @IsInt({ message: 'Поле должно быть целым положительным числом' })
  readonly price: number;

  @IsInt({ message: 'Поле должно быть целым положительным числом' })
  readonly quantity: number;
}
