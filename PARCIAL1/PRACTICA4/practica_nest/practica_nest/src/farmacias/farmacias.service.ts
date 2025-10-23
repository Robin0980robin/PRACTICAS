import { Injectable } from '@nestjs/common';
import { CreateFarmaciaDto } from './dto/create-farmacia.dto';
import { UpdateFarmaciaDto } from './dto/update-farmacia.dto';

@Injectable()
export class FarmaciasService {
  create(createFarmaciaDto: CreateFarmaciaDto) {
    return 'This action adds a new farmacia';
  }

  findAll() {
    return `This action returns all farmacias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} farmacia`;
  }

  update(id: number, updateFarmaciaDto: UpdateFarmaciaDto) {
    return `This action updates a #${id} farmacia`;
  }

  remove(id: number) {
    return `This action removes a #${id} farmacia`;
  }
}
