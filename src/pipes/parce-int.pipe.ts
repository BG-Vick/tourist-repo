import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const val = Math.abs(parseInt(value, 10));
    if (isNaN(val)) {
      throw new ValidationException("Значение ':id' должно быть целым числом");
    }
    return val;
  }
}
