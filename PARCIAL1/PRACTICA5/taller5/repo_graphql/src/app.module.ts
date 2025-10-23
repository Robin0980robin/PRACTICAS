import { Module } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { RestClientsModule } from './rest-clients/rest-clients.module';

@Module({
  imports: [
    AnalyticsModule,
    RestClientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}