import { Module } from '@nestjs/common';
import { PrescripcionesController } from './prestamos.controller';
import { PrescripcionesService } from './prestamos.service';

@Module({
  controllers: [PrescripcionesController],
  providers: [PrescripcionesService],
  exports: [PrescripcionesService],
})
export class PrescripcionesModule {}
