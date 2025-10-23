import { Module } from '@nestjs/common';
import { DetallePrescripcionesService } from './detalle-prescripciones.service';
import { DetallePrescripcionesController } from './detalle-prescripciones.controller';

@Module({
  controllers: [DetallePrescripcionesController],
  providers: [DetallePrescripcionesService],
})
export class DetallePrescripcionesModule {}
