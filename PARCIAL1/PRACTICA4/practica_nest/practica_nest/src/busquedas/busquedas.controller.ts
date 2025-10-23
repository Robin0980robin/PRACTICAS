import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BusquedasService } from './busquedas.service';
import { CreateBusquedaDto } from './dto/create-busqueda.dto';
import { UpdateBusquedaDto } from './dto/update-busqueda.dto';

@Controller('busquedas')
export class BusquedasController {
  constructor(private readonly busquedasService: BusquedasService) {}

  @Post()
  create(@Body() createBusquedaDto: CreateBusquedaDto) {
    return this.busquedasService.create(createBusquedaDto);
  }

  @Get()
  findAll() {
    return this.busquedasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.busquedasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusquedaDto: UpdateBusquedaDto) {
    return this.busquedasService.update(+id, updateBusquedaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.busquedasService.remove(+id);
  }
}
