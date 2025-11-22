import { Module } from '@nestjs/common';
import { AzureServiceBusEmailService } from './services/azure-service-bus-email.service';
import { AzureBlobStorageService } from './services/azure-blob-storage.service';

@Module({
  providers: [
    {
      provide: 'EmailMessagingPort',
      useClass: AzureServiceBusEmailService,
    },
    {
      provide: 'FileStoragePort',
      useClass: AzureBlobStorageService,
    },
  ],
  exports: ['EmailMessagingPort', 'FileStoragePort'],
})
export class ExternalModule {}

