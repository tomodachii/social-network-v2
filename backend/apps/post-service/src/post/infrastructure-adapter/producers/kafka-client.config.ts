import { POST_KAFKA_CLIENT } from '@lib/post/feature';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const KafkaConfig: ClientProviderOptions = {
  name: POST_KAFKA_CLIENT,
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'post-service',
      brokers: ['localhost:29092'],
      connectionTimeout: 3000,
    },
    producer: {
      allowAutoTopicCreation: true,
    },
  },
};
