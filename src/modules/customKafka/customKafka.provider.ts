import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientKafka,
  KafkaHeaders,
  KafkaOptions,
  ReadPacket,
  WritePacket,
} from '@nestjs/microservices';

export type KafkaOption = KafkaOptions['options'];

export interface KafkaRequest<T = any> {
  key: Buffer | string | null;
  value: T;
  headers: Record<string, any>;
}

/**
 * 覆盖 getResponsePatternName
 * @export
 * @class CustomKafkaClient
 * @extends {ClientKafka}
 */
@Injectable()
export class CustomKafkaClient extends ClientKafka {
  constructor(options: KafkaOption) {
    super(options);
  }

  /**
   * 覆盖，防止低版本kafka 没有触发on监听事件
   * @protected
   * @param {string} topic
   * @return {*}  {string}
   * @memberof CustomKafkaClient
   */
  protected getReplyTopicPartition(topic: string): string {
    const minimumPartition = this.consumerAssignments[topic];
    return !!minimumPartition ? minimumPartition.toString() : '2'; // 设置最小分区
  }

  /**
   * 覆盖publish ,里面使用routingMap来存储和处理回调(是本地缓存)，在多个服务中,就会导致内存溢出问题。
   * @protected
   * @param {ReadPacket} partialPacket
   * @param {(packet: WritePacket) => any} callback
   * @return {*}  {() => void}
   * @memberof CustomKafkaClient
   */
  protected publish(
    partialPacket: ReadPacket,
    callback: (packet: WritePacket) => any,
  ): () => void {
    const packet = this.assignPacketId(partialPacket);
    try {
      const pattern = this.normalizePattern(partialPacket.pattern);
      const replyTopic = this.getResponsePatternName(pattern);
      const replyPartition = this.getReplyTopicPartition(replyTopic);

      Promise.resolve(this.serializer.serialize(packet.data, { pattern }))
        .then((serializedPacket: KafkaRequest) => {
          serializedPacket.headers[KafkaHeaders.CORRELATION_ID] = packet.id;
          serializedPacket.headers[KafkaHeaders.REPLY_TOPIC] = replyTopic;
          serializedPacket.headers[KafkaHeaders.REPLY_PARTITION] =
            replyPartition;

          const message = Object.assign(
            {
              topic: pattern,
              messages: [serializedPacket],
            },
            this.options?.send || {},
          );

          return this.producer?.send(message);
        })
        .catch((err) => {
          callback({ err });
        });
      return callback({});
    } catch (err) {
      return () => {
        callback({ err });
      };
    }
  }
}
