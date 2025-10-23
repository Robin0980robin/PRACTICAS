import { Module } from '@nestjs/common';
import { DetalleRecetasService } from './detalle-recetas.service';
import { DetalleRecetasController } from './detalle-recetas.controller';

@Module({
  controllers: [DetalleRecetasController],
  providers: [DetalleRecetasService],
})
export class DetalleRecetasModule {}
