import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsInt, IsString, Length } from 'class-validator';

export class UpdateUserAuthDataDto {
  @Transform(({ value }) => Number(value))
  @IsInt({ message: ' userId - должно быть числом' })
  readonly userId: number;

  @ApiProperty({ example: 'user@mail.com', description: 'почтовый адрес' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @ApiProperty({ example: 'qwerty12345', description: 'пароль пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, { message: 'Не менее 4 и не более 16 символов' })
  readonly password: string;
}
