import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    //Apply validarions GLOBALLY. All payloads will be checked vs corresponding DTO's
    new ValidationPipe({
      whitelist: true, //input attributes in payloads or query params other than
      // those in DTO's are IGNORED
      forbidNonWhitelisted: true, //input attributes in payloads or query params oher
      // than those in DTO's are not
      // accepted
      //These two properties allows automatic  transformation of data coming
      //in  query params to numbers (given that everything in query params arrive
      // as strings)
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
