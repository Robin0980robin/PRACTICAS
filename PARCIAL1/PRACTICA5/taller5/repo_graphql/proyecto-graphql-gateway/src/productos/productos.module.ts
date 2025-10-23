import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductosResolver } from './productos.resolver';
import { ProductosRestService } from './productos-rest.service';

@Module({
  imports: [HttpModule],
  providers: [ProductosResolver, ProductosRestService],
  exports: [ProductosRestService], // Para uso en otros módulos
})
export class ProductosModule {}