import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FarmaciasService } from './farmacias.service';
import { CreateFarmaciaDto } from './dto/create-farmacia.dto';
import { UpdateFarmaciaDto } from './dto/update-farmacia.dto';

@Controller('farmacias')
export class FarmaciasController {
  constructor(private readonly farmaciasService: FarmaciasService) {}

  @Post()
  create(@Body() createFarmaciaDto: CreateFarmaciaDto) {
    return this.farmaciasService.create(createFarmaciaDto);
  }

  @Get()
  findAll() {
    return this.farmaciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmaciasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFarmaciaDto: UpdateFarmaciaDto) {
    return this.farmaciasService.update(+id, updateFarmaciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmaciasService.remove(+id);
  }
}
