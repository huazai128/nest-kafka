import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './modules/kafka/kafka.module';
import { TestModule } from './modules/Test/test.module';

@Module({
  imports: [KafkaModule, TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
