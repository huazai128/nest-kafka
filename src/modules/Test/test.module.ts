import { Module } from '@nestjs/common';
import { kafkaOptions, MONITOR_SERVICE } from 'config';
import { CustomKafkaModule } from '../customKafka/customKafka.module';
import { Transport } from '@nestjs/microservices';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    CustomKafkaModule.register({
      name: MONITOR_SERVICE,
      transport: Transport.KAFKA,
      options: kafkaOptions,
    }),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
