import { MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(1, { message: 'Не может быть пустым' })
  readonly title: string;
  @MinLength(1, { message: 'Не может быть пустым' })
  readonly content: string;
  @MinLength(1, { message: 'Не может быть пустым' })
  readonly userId: number; // TODO: update - get id from token
}
