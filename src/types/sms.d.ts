/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IncomingSMSData {
  from: string;          // Phone number that sent the SMS
  message: string;       // SMS content
  timestamp: string;     // When received
  messageId?: string;    // Semaphore message ID
}

export interface OutgoingSMSData {
  to: string;           // Phone number to send to
  message: string;      // SMS content
  sendername?: string;  // Sender name override
}

export interface SMSWebhookPayload {
  message_id: string;
  recipient: string;
  message: string;
  sender_name: string;
  status: string;
  created_at: string;
  [key: string]: any;  // Additional Semaphore fields
}