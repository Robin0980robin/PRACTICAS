import { Injectable } from '@nestjs/common';
import { CreateDetallePrescripcioneDto } from './dto/create-detalle-prescripcione.dto';
import { UpdateDetallePrescripcioneDto } from './dto/update-detalle-prescripcione.dto';

@Injectable()
export class DetallePrescripcionesService {
  create(createDetallePrescripcioneDto: CreateDetallePrescripcioneDto) {
    return 'This action adds a new detallePrescripcione';
  }

  findAll() {
    return `This action returns all detallePrescripciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallePrescripcione`;
  }

  update(id: number, updateDetallePrescripcioneDto: UpdateDetallePrescripcioneDto) {
    return `This action updates a #${id} detallePrescripcione`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallePrescripcione`;
  }
}
