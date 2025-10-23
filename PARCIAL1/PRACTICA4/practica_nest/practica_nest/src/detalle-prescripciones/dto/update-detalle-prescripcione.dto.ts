import { PartialType } from '@nestjs/swagger';
import { CreateDetallePrescripcioneDto } from './create-detalle-prescripcione.dto';

export class UpdateDetallePrescripcioneDto extends PartialType(CreateDetallePrescripcioneDto) {}
