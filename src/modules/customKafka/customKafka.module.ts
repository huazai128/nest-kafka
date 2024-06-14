import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';
import { CustomKafkaClient, KafkaOption } from './customKafka.provider';
import {
  ClientProviderOptions,
  ClientProxy,
  Closeable,
} from '@nestjs/microservices';
import { MONITOR_SERVICE } from 'config';

@Module({})
export class CustomKafkaModule {
  static register(options: ClientProviderOptions): DynamicModule {
    const client = {
      provide: MONITOR_SERVICE,
      useValue: this.assignOnAppShutdownHook(
        new CustomKafkaClient(options.options as KafkaOption),
      ),
    };
    return {
      module: CustomKafkaModule,
      global: false,
      providers: [client],
      exports: [client],
    };
  }
  private static assignOnAppShutdownHook(client: ClientProxy & Closeable) {
    (client as unknown as OnApplicationShutdown).onApplicationShutdown =
      client.close;
    return client;
  }
}
