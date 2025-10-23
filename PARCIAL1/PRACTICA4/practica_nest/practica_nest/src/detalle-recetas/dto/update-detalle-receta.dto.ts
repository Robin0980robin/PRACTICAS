import { PartialType } from '@nestjs/swagger';
import { CreateDetalleRecetaDto } from './create-detalle-receta.dto';

export class UpdateDetalleRecetaDto extends PartialType(CreateDetalleRecetaDto) {}
