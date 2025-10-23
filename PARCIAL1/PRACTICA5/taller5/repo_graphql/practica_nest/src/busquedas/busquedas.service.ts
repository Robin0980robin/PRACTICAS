import { Injectable } from '@nestjs/common';
import { CreateBusquedaDto } from './dto/create-busqueda.dto';
import { UpdateBusquedaDto } from './dto/update-busqueda.dto';

@Injectable()
export class BusquedasService {
  create(createBusquedaDto: CreateBusquedaDto) {
    return 'This action adds a new busqueda';
  }

  findAll() {
    return `This action returns all busquedas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} busqueda`;
  }

  update(id: number, updateBusquedaDto: UpdateBusquedaDto) {
    return `This action updates a #${id} busqueda`;
  }

  remove(id: number) {
    return `This action removes a #${id} busqueda`;
  }
}
