import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaOptions, MONITOR_SERVICE } from 'config';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [
    // 生产者注册
    ClientsModule.register([
      {
        name: MONITOR_SERVICE,
        transport: Transport.KAFKA,
        options: kafkaOptions,
      },
    ]),
  ],
  controllers: [KafkaController],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
