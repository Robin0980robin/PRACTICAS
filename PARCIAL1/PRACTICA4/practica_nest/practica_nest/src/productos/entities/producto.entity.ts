import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DetalleReceta } from '../../detalle-recetas/entities/detalle-receta.entity';
import { DetallePrescripcion } from '../../detalle-prescripciones/entities/detalle-prescripcion.entity';

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Identificador único del producto' })
    id_producto: number;

    @ApiProperty({ example: 'Paracetamol', description: 'Nombre genérico del producto' })
    @Column()
    nombre_generico: string;

    @ApiProperty({ example: 'Tylenol', description: 'Nombre comercial del producto' })
    @Column()
    nombre_comercial: string;

    @ApiProperty({ example: 'Paracetamol', description: 'Principio activo' })
    @Column()
    principio_activo: string;

    @ApiProperty({ example: 'Analgésico', description: 'Categoría farmacológica' })
    @Column()
    categoria: string;

    @ApiProperty({ example: 'Tabletas 500mg', description: 'Presentación del producto' })
    @Column()
    presentacion: string;

    @ApiProperty({ example: '500 mg', description: 'Concentración del principio activo' })
    @Column()
    concentracion: string;

    @ApiProperty({ example: false, description: 'Indica si el producto requiere receta médica' })
    @Column()
    requiere_receta: boolean;

    @OneToMany(() => DetalleReceta, detalleReceta => detalleReceta.producto)
    detallesReceta: DetalleReceta[];

    @OneToMany(() => DetallePrescripcion, detallePrescripcion => detallePrescripcion.producto)
    detallesPrescripcion: DetallePrescripcion[];
}
