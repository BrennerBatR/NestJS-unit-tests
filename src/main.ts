import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import './envs';

async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const options = new DocumentBuilder()
    .setTitle('Project Api')
    .setDescription('Back-end')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Back-end')
    .build();

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const PORT = Number(process.env.PORT) || 3000;
  await app.listen(PORT, '0.0.0.0');
  console.log('App is listening port : ', PORT);
}
bootstrap();
