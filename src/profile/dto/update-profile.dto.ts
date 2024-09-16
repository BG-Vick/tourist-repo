import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @MinLength(2, { message: 'Не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly preferredComunication: string;

  @MinLength(4, { message: 'Не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly contactData: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @Transform(({ value }) => (value === '' ? null : value))
  readonly firstName?: string | null;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @Transform(({ value }) => (value === '' ? null : value))
  readonly lastName?: string | null;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @Transform(({ value }) => (value === '' ? null : value))
  readonly adress?: string | null;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @Transform(({ value }) => (value === '' ? null : value))
  readonly comment?: string | null;
}
