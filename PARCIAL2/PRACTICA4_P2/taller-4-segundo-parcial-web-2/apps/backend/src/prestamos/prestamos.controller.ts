import { Controller, Get, Post, Put, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PrescripcionesService, Medicamento } from './prestamos.service';

@Controller('prescripciones')
export class PrescripcionesController {
  constructor(private readonly prescripcionesService: PrescripcionesService) {}

  @Post()
  async crear(@Body() createDto: {
    pacienteId: string;
    pacienteNombre: string;
    medicoId: string;
    medicoNombre: string;
    medicamentos: Medicamento[];
    diasValidez?: number;
  }) {
    return this.prescripcionesService.crearPrescripcion(createDto);
  }

  @Get()
  listar() {
    return this.prescripcionesService.listarPrescripciones();
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.prescripcionesService.obtenerPrescripcion(id);
  }

  @Put(':id/surtir')
  surtir(
    @Param('id', ParseIntPipe) id: number,
    @Body() surtirDto: { farmacia: string; precioTotal: number }
  ) {
    return this.prescripcionesService.surtirPrescripcion(
      id,
      surtirDto.farmacia,
      surtirDto.precioTotal
    );
  }

  @Post('verificar-vencidas')
  verificarVencidas() {
    return this.prescripcionesService.verificarPrescripcionesVencidas();
  }
}
