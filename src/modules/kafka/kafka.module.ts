import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaOptions, MONITOR_SERVICE } from 'config';
import { KafkaService } from './kafka.service';
import { KafkaCOntroller } from './kafka.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MONITOR_SERVICE,
        transport: Transport.KAFKA,
        options: kafkaOptions,
      },
    ]),
  ],
  providers: [KafkaService, KafkaCOntroller],
  exports: [KafkaService],
})
export class KafkaModule {}
