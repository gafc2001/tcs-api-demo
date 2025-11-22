import { Injectable, Logger } from '@nestjs/common';
import { FileStoragePort } from '../../../domain/ports/file-storage.port';
import { BlobServiceClient } from '@azure/storage-blob';

@Injectable()
export class AzureBlobStorageService implements FileStoragePort {
  private readonly logger = new Logger(AzureBlobStorageService.name);

  async saveFileAsync(fileName: string, file: Buffer): Promise<string> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION!);
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER!);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const result = await blockBlobClient.upload(file, file.length, {
      blobHTTPHeaders: { blobContentType: 'application/octet-stream' }
    });

    return result._response.request.url;
  }
}

