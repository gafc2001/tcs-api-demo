export interface EmailMessage {
  to: string;
  subject: string;
  message: string;
}

export interface EmailMessagingPort {
  sendEmailAsync(message: EmailMessage): Promise<void>;
}
