import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DetalleReceta } from '../../detalle-recetas/entities/detalle-receta.entity';
import { Farmacia } from '../../farmacias/entities/farmacia.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_prescripciones')
export class DetallePrescripcion {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Identificador del detalle de prescripción' })
    id_detalle_prescripcion: number;

    @ApiProperty({ example: 12.5, description: 'Precio encontrado en la farmacia' })
    @Column('decimal', { precision: 10, scale: 2 })
    precio_encontrado: number;

    @ApiProperty({ example: 1.2, description: 'Distancia en kilómetros hasta la farmacia' })
    @Column('float')
    distancia: number;

    @ApiProperty({ example: '2025-10-15', description: 'Fecha de la consulta de precio' })
    @Column({ type: 'date' })
    fecha_consulta: Date;

    @ApiProperty({ example: 'API de precios', description: 'Fuente de información del precio' })
    @Column()
    fuente: string;

    @ManyToOne(() => DetalleReceta, detalleReceta => detalleReceta.detallesPrescripcion)
    detalleReceta: DetalleReceta;

    @ManyToOne(() => Farmacia, farmacia => farmacia.detallesPrescripcion)
    farmacia: Farmacia;

    @ManyToOne(() => Producto, producto => producto.detallesPrescripcion)
    producto: Producto;
}