import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicosModule } from './medicos/medicos.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { RecetasModule } from './recetas/recetas.module';
import { ProductosModule } from './productos/productos.module';
import { DetalleRecetasModule } from './detalle-recetas/detalle-recetas.module';
import { FarmaciasModule } from './farmacias/farmacias.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { DetallePrescripcionesModule } from './detalle-prescripciones/detalle-prescripciones.module';
import { BusquedasModule } from './busquedas/busquedas.module';
@Module({
 imports: [
 TypeOrmModule.forRoot({
 type: 'sqlite',
 database: 'proyecto-equipo.sqlite',
 entities: [__dirname + '/**/*.entity{.ts,.js}'],
 synchronize: true, // Solo desarrollo
 logging: true, // Para debug
 }),
 MedicosModule,
 PacientesModule,
 RecetasModule,
 ProductosModule,
 DetalleRecetasModule,
 FarmaciasModule,
 SucursalesModule,
 DetallePrescripcionesModule,
 BusquedasModule,
 // Aquí se importarán los módulos de cada entidad
 ],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}