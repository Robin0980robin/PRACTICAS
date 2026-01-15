import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookEmitterService } from './webhook-emitter.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [WebhookEmitterService],
  exports: [WebhookEmitterService],
})
export class WebhookModule {}
