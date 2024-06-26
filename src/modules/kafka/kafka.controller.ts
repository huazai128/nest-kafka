import { Controller, Get } from '@nestjs/common';
import { KafkaService, Item } from './kafka.service';
import { Observable } from 'rxjs';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { MONITOR_TOPIC } from 'config';

@Controller()
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Get('producer')
  getHello(): string {
    Array.from({ length: 1000 }).map((item, index) => {
      this.kafkaService.sendMessage({
        id: index,
        name: `kafka-${index}`,
      });
    });
    return '发送成功';
  }

  @MessagePattern(MONITOR_TOPIC)
  handleMessage(@Payload() data: Item, @Ctx() context: KafkaContext) {
    console.log(data, 'data');
  }
}
