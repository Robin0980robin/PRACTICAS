// src/productos/productos.resolver.ts
import { Resolver, Query, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ProductoType } from '../types/producto.type';
import { ProductosRestService } from './productos-rest.service';
import { CategoriasRestService } from '../categorias/categorias-rest.service';
@Resolver(() => ProductoType)
export class ProductosResolver {
 constructor(
 private productosService: ProductosRestService,
 private categoriasService: CategoriasRestService,
 ) {}
 @Query(() => [ProductoType], { name: 'productos' })
 async getProductos() {
 return this.productosService.findAll();
 }
 @Query(() => ProductoType, { name: 'producto' })
 async getProducto(@Args('id', { type: () => Int }) id: number) {
 return this.productosService.findOne(id);
 }
 // Field Resolver para poblar relaciones
 @ResolveField()
 async categoria(@Parent() producto: ProductoType) {
 return this.categoriasService.findOne(producto.categoriaId);
 }
}