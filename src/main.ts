import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { RabbitMQModules } from './rabbitmq.module';

async function bootstrap() {
  const app = await NestFactory.create(RabbitMQModules);

  // Define RabbitMQ microservice
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'product_queue',
      noAck : false,
      queueOptions: {
        durable: true,
      },
    },
  });

  // Enable the event pattern
  app.enableShutdownHooks();

  // Use startAllMicroservices instead of startAllMicroservicesAsync
  await app.startAllMicroservices();

  // Start the HTTP server
  await app.listen(3000);

  console.log('Application is listening on port 3000');
}

bootstrap();
