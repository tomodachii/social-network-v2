import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { logLevel } from 'kafkajs';
import { USER_KAFKA_CLIENT } from '../../user.di-token';

export const KafkaConfig: ClientProviderOptions = {
  name: USER_KAFKA_CLIENT,
  transport: Transport.KAFKA,
  options: {
    client: {
      ssl: true,
      clientId: 'user-service',
      brokers: ['localhost:9092'],
      connectionTimeout: 30000,
    },
    consumer: {
      groupId: 'user-consumer',
    },
    producer: {
      allowAutoTopicCreation: true,
    },
  },
};
