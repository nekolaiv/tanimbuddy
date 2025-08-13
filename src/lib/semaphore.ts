import axios from 'axios';

const SEMAPHORE_BASE_URL = 'https://api.semaphore.co/api/v4/messages';

interface SendSMSOptions {
  number: string;
  message: string;
  sendername?: string;
}

interface SendSMSResponse {
  message_id: number;
  user_id: number;
  user: string;
  account_id: number;
  account: string;
  recipient: string;
  message: string;
  sender_name: string;
  network: string;
  status: string;
  type: string;
  source: string;
  created_at: string;
  updated_at: string;
}

interface WebhookPayload {
  message_id: string;
  account_id: string;
  account: string;
  recipient: string;
  message: string;
  sender_name: string;
  network: string;
  status: string;
  type: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export class SemaphoreClient {
  private apiKey: string;
  private senderName: string;

  constructor(apiKey: string, senderName: string = 'SEMAPHORE') {
    this.apiKey = apiKey;
    this.senderName = senderName;
  }

  async sendSMS({ number, message, sendername }: SendSMSOptions): Promise<SendSMSResponse> {
    try {
      const response = await axios.post(`${SEMAPHORE_BASE_URL}`, {
        apikey: this.apiKey,
        number: number,
        message: message,
        sendername: sendername || this.senderName,
      });

      return response.data[0]; // Semaphore returns array
    } catch (error) {
      console.error('Full error:', error);
      console.error('Semaphore SMS Error:', error);
      throw new Error('Failed to send SMS via Semaphore');
    }
  }

  async getAccountInfo() {
    try {
      const response = await axios.get(`${SEMAPHORE_BASE_URL}/v4/account`, {
        params: { apikey: this.apiKey }
      });
      return response.data;
    } catch (error) {
      console.error('Semaphore Account Error:', error);
      throw new Error('Failed to get Semaphore account info');
    }
  }

  // Validate webhook signature (if using webhook secrets)
  validateWebhook(payload: string, signature: string, secret: string): boolean {
    // Implement webhook validation if Semaphore provides signature verification
    // For now, we'll do basic validation
    return true;
  }
}

// Singleton instance
export const semaphoreClient = new SemaphoreClient(
  process.env.SEMAPHORE_API_KEY || '',
  process.env.SEMAPHORE_SENDER_NAME || 'SEMAPHORE'
);