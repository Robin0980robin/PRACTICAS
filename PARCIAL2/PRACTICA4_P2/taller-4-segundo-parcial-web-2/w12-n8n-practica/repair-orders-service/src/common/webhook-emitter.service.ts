import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookEmitterService {
  private readonly logger = new Logger(WebhookEmitterService.name);
  private readonly n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  async emit(evento: string, payload: any): Promise<void> {
    // Skip if webhook URL not configured
    if (!this.n8nWebhookUrl) {
      this.logger.warn('N8N_WEBHOOK_URL not configured - skipping event emission');
      return;
    }

    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evento,
          timestamp: new Date().toISOString(),
          data: payload,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        this.logger.log(`✅ Event "${evento}" emitted to n8n successfully`);
        this.logger.debug(`📥 n8n response: ${JSON.stringify(responseData)}`);
      } else {
        this.logger.warn(`⚠️ n8n returned status ${response.status} for event "${evento}"`);
      }
    } catch (error) {
      // Non-blocking error - log but don't fail the operation
      this.logger.error(`❌ Error emitting webhook: ${error.message}`);
    }
  }
}