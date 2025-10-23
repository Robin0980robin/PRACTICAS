import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { RecetasClient } from '../rest-clients/recetas.client';
import { MedicosClient } from '../rest-clients/medicos.client';
import { PacientesClient } from '../rest-clients/pacientes.client';

@Module({
  providers: [
    AnalyticsService,
    AnalyticsResolver,
    RecetasClient,
    MedicosClient,
    PacientesClient,
  ],
})
export class AnalyticsModule {}