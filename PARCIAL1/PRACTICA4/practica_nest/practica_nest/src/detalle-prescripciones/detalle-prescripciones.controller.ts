import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallePrescripcionesService } from './detalle-prescripciones.service';
import { CreateDetallePrescripcioneDto } from './dto/create-detalle-prescripcione.dto';
import { UpdateDetallePrescripcioneDto } from './dto/update-detalle-prescripcione.dto';

@Controller('detalle-prescripciones')
export class DetallePrescripcionesController {
  constructor(private readonly detallePrescripcionesService: DetallePrescripcionesService) {}

  @Post()
  create(@Body() createDetallePrescripcioneDto: CreateDetallePrescripcioneDto) {
    return this.detallePrescripcionesService.create(createDetallePrescripcioneDto);
  }

  @Get()
  findAll() {
    return this.detallePrescripcionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallePrescripcionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallePrescripcioneDto: UpdateDetallePrescripcioneDto) {
    return this.detallePrescripcionesService.update(+id, updateDetallePrescripcioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallePrescripcionesService.remove(+id);
  }
}
