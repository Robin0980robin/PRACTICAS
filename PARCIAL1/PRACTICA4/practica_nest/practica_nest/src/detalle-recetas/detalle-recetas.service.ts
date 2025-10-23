import { Injectable } from '@nestjs/common';
import { CreateDetalleRecetaDto } from './dto/create-detalle-receta.dto';
import { UpdateDetalleRecetaDto } from './dto/update-detalle-receta.dto';

@Injectable()
export class DetalleRecetasService {
  create(createDetalleRecetaDto: CreateDetalleRecetaDto) {
    return 'This action adds a new detalleReceta';
  }

  findAll() {
    return `This action returns all detalleRecetas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detalleReceta`;
  }

  update(id: number, updateDetalleRecetaDto: UpdateDetalleRecetaDto) {
    return `This action updates a #${id} detalleReceta`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalleReceta`;
  }
}
