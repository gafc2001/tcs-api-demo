import { Injectable, Logger } from '@nestjs/common';
import { EmailMessagingPort, EmailMessage } from '../../../domain/ports/email-messaging.port';
import { ServiceBusClient } from '@azure/service-bus';

@Injectable()
export class AzureServiceBusEmailService implements EmailMessagingPort {
  async sendEmailAsync(message: EmailMessage): Promise<void> {
    const serviceBusClient = new ServiceBusClient(process.env.AZURE_SB_CONNECTION!);
    const sender = serviceBusClient.createSender(process.env.AZURE_SB_QUEUE!);
    await sender.sendMessages({ body: JSON.stringify(message) });
    await sender.close();
    await serviceBusClient.close();
  }
}

