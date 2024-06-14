import { Controller, Get } from '@nestjs/common';
import { TestService, Item } from './test.service';
import { Observable } from 'rxjs';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { MONITOR_TOPIC } from 'config';

@Controller()
export class TestController {
  constructor(private readonly kafkaService: TestService) {}

  @Get('test')
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
    console.log(data, 'data========');
  }
}
