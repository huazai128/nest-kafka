import { Controller, Get } from '@nestjs/common';
import { TestService, Item } from './test.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MONITOR_TOPIC } from 'config';

@Controller()
export class TestController {
  constructor(private readonly kafkaService: TestService) {}

  private fibonacci(n: number) {
    return n < 1
      ? 0
      : n <= 2
        ? 1
        : this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  @Get('test1')
  getTestKafka(): string {
    const value = this.fibonacci(40);
    return value;
  }

  @Get('test')
  getTest() {
    this.kafkaService.sendMessage({
      id: 40,
      name: `kafka`,
    });
    return '发送成功';
  }

  @MessagePattern(MONITOR_TOPIC)
  handleMessage(@Payload() data: Item) {
    console.log('data');
    return this.fibonacci(data.id);
  }
}
