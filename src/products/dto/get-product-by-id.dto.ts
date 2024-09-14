import { IsInt, IsNotEmpty } from 'class-validator';

export class GetProductByIdDto {
  @IsInt({ message: 'Должно быть числом' })
  @IsNotEmpty({ message: 'Не может быть пустым' })
  id: number;
}
