import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { kafkaOptions } from 'config';
import { networkInterfaces } from 'os';

export function getServerIp(): string | undefined {
  const interfaces = networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName] as Array<any>;
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 消费服务创建
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: kafkaOptions,
  });
  // 开始微服务
  await app.startAllMicroservices();
  // 监听端口
  await app.listen(3000).then(() => {
    console.log(`Application is running on: http://${getServerIp()}:3000`);
  });

  microservice.listen().then((port) => {
    console.log('Microservice is listening');
  });
}
bootstrap();
