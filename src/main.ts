import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { kafkaOptions } from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 服务
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: kafkaOptions,
  });
  await app.startAllMicroservices();
  await app.listen(3000);

  microservice.listen().then((port) => {
    console.log('Microservice is listening');
  });
}
bootstrap();
