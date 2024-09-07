import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const match = file.originalname.match(/\.[^\.]+$/);
      const extension: string = match ? match[0] : '.jpg';
      const fileName: string = uuid.v4() + `${extension}`;
      const filePath = path.resolve(__dirname, '..', 'static');
      try {
        await fs.access(filePath);
      } catch {
        await fs.mkdir(filePath, { recursive: true });
      }
      await fs.writeFile(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
