import { PartialType } from '@nestjs/mapped-types';
import { CreateBusquedaDto } from './create-busqueda.dto';

export class UpdateBusquedaDto extends PartialType(CreateBusquedaDto) {}
