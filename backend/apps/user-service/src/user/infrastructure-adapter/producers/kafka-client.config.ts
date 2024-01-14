import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { USER_KAFKA_CLIENT } from '@lib/user/feature';

export const KafkaConfig: ClientProviderOptions = {
  name: USER_KAFKA_CLIENT,
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'user-service',
      brokers: ['localhost:29092'],
      connectionTimeout: 3000,
    },
    producer: {
      allowAutoTopicCreation: true,
    },
  },
};
