import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MONITOR_SERVICE, MONITOR_TOPIC } from 'config';

export interface Item {
  id: number;
  name: string;
}

@Injectable()
export class KafkaService implements OnModuleInit {
  // topic 话题
  private topic = MONITOR_TOPIC;

  // 注入kafka
  constructor(@Inject(MONITOR_SERVICE) private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf(this.topic);
    await this.client.connect();
  }

  /**
   * 生产者，发送
   * @param {Item} data
   * @memberof KafkaService
   */
  public sendMessage(data: Item) {
    return this.client.send<Item>(this.topic, JSON.stringify(data));
  }
}
