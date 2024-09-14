import { IsInt, IsString, MinLength } from 'class-validator';

export class ProductDto {
  @MinLength(1, { message: 'Не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly title: string;

  @MinLength(1, { message: 'Не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string;

  @MinLength(1, { message: 'Не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly image: string;

  @IsInt({ message: 'Поле должно быть целым положительным числом' })
  readonly quantity: number;
}
