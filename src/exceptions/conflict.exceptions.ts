import { ConflictException } from '@nestjs/common';

export class CustomConflictException extends ConflictException {
  private data: any;

  constructor(message: string, data: any) {
    super(message);
    this.data = data;
  }

  getResponse() {
    return {
      statusCode: this.getStatus(),
      message: this.message,
      data: this.data,
    };
  }
}
