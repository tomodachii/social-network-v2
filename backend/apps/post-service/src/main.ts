/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from '@lib/shared/common/exceptions';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, 'Post service'));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       ssl: true,
  //       clientId: 'post-service',
  //       brokers: ['localhost:9092'],
  //       connectionTimeout: 300000,
  //       retry: {
  //         initialRetryTime: 100,
  //         retries: 8,
  //       },
  //     },
  //     consumer: {
  //       groupId: 'post-consumer',
  //       allowAutoTopicCreation: true,
  //     },
  //     producer: {
  //       allowAutoTopicCreation: true,
  //     },
  //   },
  // });
  // await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Post service is running on: http://localhost:${port}`);
}

bootstrap();
