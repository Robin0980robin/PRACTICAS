import { PartialType } from '@nestjs/swagger';
import { CreateFarmaciaDto } from './create-farmacia.dto';

export class UpdateFarmaciaDto extends PartialType(CreateFarmaciaDto) {}
