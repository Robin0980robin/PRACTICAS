import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post('seed')
  async seed() {
    const productos = [
      {
        nombre_generico: 'Paracetamol',
        nombre_comercial: 'Tylenol',
        principio_activo: 'Paracetamol',
        categoria: 'Analgésico',
        presentacion: 'Tabletas',
        concentracion: '500mg',
        requiere_receta: false
      },
      {
        nombre_generico: 'Ibuprofeno',
        nombre_comercial: 'Advil',
        principio_activo: 'Ibuprofeno',
        categoria: 'Antiinflamatorio',
        presentacion: 'Tabletas',
        concentracion: '400mg',
        requiere_receta: false
      },
      {
        nombre_generico: 'Amoxicilina',
        nombre_comercial: 'Amoxil',
        principio_activo: 'Amoxicilina',
        categoria: 'Antibiótico',
        presentacion: 'Cápsulas',
        concentracion: '500mg',
        requiere_receta: true
      },
      {
        nombre_generico: 'Omeprazol',
        nombre_comercial: 'Prilosec',
        principio_activo: 'Omeprazol',
        categoria: 'Antiácido',
        presentacion: 'Cápsulas',
        concentracion: '20mg',
        requiere_receta: false
      },
      {
        nombre_generico: 'Loratadina',
        nombre_comercial: 'Claritin',
        principio_activo: 'Loratadina',
        categoria: 'Antihistamínico',
        presentacion: 'Tabletas',
        concentracion: '10mg',
        requiere_receta: false
      }
    ];

    const created: any[] = [];
    for (const p of productos) {
      created.push(await this.create(p as CreateProductoDto));
    }
    
    return { message: `${created.length} productos creados`, productos: created };
  }

  @Post()
  create(@Body() dto: CreateProductoDto) {
    return this.productoService.create(dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.productoService.buscarProductos(search);
    }
    return this.productoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto) {
    return this.productoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.remove(id);
  }
}
