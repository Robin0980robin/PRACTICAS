// src/productos/productos-rest.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class ProductosRestService {
 constructor(private readonly httpService: HttpService) {}
 async findAll() {
 const response = await firstValueFrom(
 this.httpService.get('/productos')
 );
 return response.data;
 }
 async findOne(id: number) {
 const response = await firstValueFrom(
 this.httpService.get(`/productos/${id}`)
 );
 return response.data;
 }
 async findByCategoria(categoriaId: number) {
 // Obtener todos los productos y filtrar
 const productos = await this.findAll();
 return productos.filter(p => p.categoriaId === categoriaId);
 }
}
// Similar para CategoriasRestService, VentasRestService, etc.