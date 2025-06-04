import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT!);

  console.log(`Server running on port ${process.env.PORT}`);
}

bootstrap().catch((err) => {
  console.error('앱 실행 중 오류 발생:', err);
});
