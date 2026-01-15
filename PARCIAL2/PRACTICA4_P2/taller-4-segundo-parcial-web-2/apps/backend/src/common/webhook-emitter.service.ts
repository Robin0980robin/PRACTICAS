import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface WebhookPayload {
  evento: string;
  timestamp: Date;
  data: any;
  metadata?: {
    usuario?: string;
    origen?: string;
    correlationId?: string;
  };
}

@Injectable()
export class WebhookEmitterService {
  private readonly logger = new Logger(WebhookEmitterService.name);
  private readonly n8nWebhookUrl: string;
  private readonly n8nWebhookSheetsUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.n8nWebhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');
    this.n8nWebhookSheetsUrl = this.configService.get<string>('N8N_WEBHOOK_SHEETS_URL');
    
    if (this.n8nWebhookUrl) {
      this.logger.log(`📡 Webhook principal configurado: ${this.n8nWebhookUrl}`);
    } else {
      this.logger.warn('⚠️  N8N_WEBHOOK_URL no configurada. Los eventos no se emitirán.');
    }
    
    if (this.n8nWebhookSheetsUrl) {
      this.logger.log(`📊 Webhook Sheets configurado: ${this.n8nWebhookSheetsUrl}`);
    }
  }

  /**
   * Emite un evento hacia n8n
   * @param evento Nombre del evento (ej: 'prestamo.creado')
   * @param payload Datos del evento
   * @param metadata Información adicional opcional
   */
  async emit(evento: string, payload: any, metadata?: any): Promise<void> {
    if (!this.n8nWebhookUrl) {
      this.logger.warn('N8N_WEBHOOK_URL no configurada. Evento no emitido.');
      return;
    }

    const webhookPayload: WebhookPayload = {
      evento,
      timestamp: new Date(),
      data: payload,
      metadata: {
        origen: 'backend-nestjs',
        correlationId: this.generateCorrelationId(),
        ...metadata,
      },
    };

    try {
      this.logger.log(`Emitiendo evento: ${evento}`);
      
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.logger.log(`✓ Evento emitido exitosamente: ${evento}`);
      
      // Emitir también al webhook de Sheets si está configurado
      if (this.n8nWebhookSheetsUrl) {
        await this.emitToSheets(webhookPayload);
      }
    } catch (error) {
      this.logger.error(
        `Error al emitir evento ${evento}: ${error.message}`,
        error.stack,
      );
      // No lanzamos el error para no afectar el flujo principal
    }
  }

  /**
   * Emite múltiples eventos en paralelo
   */
  async emitBatch(eventos: Array<{ evento: string; payload: any; metadata?: any }>): Promise<void> {
    const promises = eventos.map(({ evento, payload, metadata }) =>
      this.emit(evento, payload, metadata),
    );
    await Promise.allSettled(promises);
  }

  /**
   * Emite evento al webhook de Google Sheets
   */
  private async emitToSheets(webhookPayload: WebhookPayload): Promise<void> {
    try {
      const response = await fetch(this.n8nWebhookSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (response.ok) {
        this.logger.log(`📊 Evento enviado a Sheets`);
      }
    } catch (error) {
      this.logger.warn(`Error al enviar a Sheets: ${error.message}`);
    }
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
