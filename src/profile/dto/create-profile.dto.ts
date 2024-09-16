import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class ProfileDto {
  @MinLength(2, { message: 'Не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly preferredComunication: string;

  @MinLength(4, { message: 'Не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly contactData: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @Transform(({ value }) => (value === '' ? null : value))
  readonly firstName: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @Transform(({ value }) => (value === '' ? null : value))
  readonly lastName: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @Transform(({ value }) => (value === '' ? null : value))
  readonly adress: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @Transform(({ value }) => (value === '' ? null : value))
  readonly comment?: string | null;

  @Transform(({ value }) => Math.abs(parseInt(value, 10)))
  @IsInt({ message: 'Поле должно быть целым положительным числом' })
  readonly userId: number;
}
