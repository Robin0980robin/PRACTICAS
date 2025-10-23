import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AnalyticsResolver } from './analytics.resolver';

@Module({
  imports: [HttpModule],
  providers: [AnalyticsResolver],
})
export class AnalyticsModule {}
