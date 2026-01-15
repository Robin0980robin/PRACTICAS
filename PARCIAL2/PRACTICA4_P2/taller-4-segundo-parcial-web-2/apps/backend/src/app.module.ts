import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './common/webhook.module';
import { PrescripcionesModule } from './prestamos/prestamos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WebhookModule,
    PrescripcionesModule,
  ],
})
export class AppModule {}
