import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleRecetasService } from './detalle-recetas.service';
import { CreateDetalleRecetaDto } from './dto/create-detalle-receta.dto';
import { UpdateDetalleRecetaDto } from './dto/update-detalle-receta.dto';

@Controller('detalle-recetas')
export class DetalleRecetasController {
  constructor(private readonly detalleRecetasService: DetalleRecetasService) {}

  @Post()
  create(@Body() createDetalleRecetaDto: CreateDetalleRecetaDto) {
    return this.detalleRecetasService.create(createDetalleRecetaDto);
  }

  @Get()
  findAll() {
    return this.detalleRecetasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleRecetasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleRecetaDto: UpdateDetalleRecetaDto) {
    return this.detalleRecetasService.update(+id, updateDetalleRecetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleRecetasService.remove(+id);
  }
}
