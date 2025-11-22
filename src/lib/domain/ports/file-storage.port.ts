export interface FileStoragePort {
  saveFileAsync(fileName: string, file: Buffer): Promise<string>;
}

