import { Controller, Get } from '@nestjs/common';
import { KafkaService, Item } from './kafka.service';
import { lastValueFrom } from 'rxjs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MONITOR_TOPIC } from 'config';

@Controller()
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  private fibonacci(n: number) {
    return n < 1
      ? 0
      : n <= 2
        ? 1
        : this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  @Get('producer')
  getHello() {
    return lastValueFrom(
      this.kafkaService.sendMessage({
        id: 40,
        name: `kafka-40`,
      }),
    );
  }

  // 测试时，另外一个消费者要屏蔽
  // @MessagePattern(MONITOR_TOPIC)
  // handleMessage(@Payload() data: Item) {
  //   console.log(data, 'data');
  //   return this.fibonacci(data.id);
  // }
}
