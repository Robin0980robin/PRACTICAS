import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Receta } from '../../recetas/entities/receta.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { DetallePrescripcion } from '../../detalle-prescripciones/entities/detalle-prescripcion.entity';

@Entity('detalle_recetas')
export class DetalleReceta {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Identificador del detalle de receta' })
    id_detalle_receta: number;

    @ApiProperty({ example: 2, description: 'Cantidad prescrita' })
    @Column()
    cantidad: number;

    @ApiProperty({ example: '1 cada 8 horas', description: 'Dosis indicada' })
    @Column()
    dosis: string;

    @ApiProperty({ example: 'Tabletas', description: 'Presentación del medicamento' })
    @Column()
    presentacion: string;

    @ApiProperty({ example: '7 días', description: 'Duración del tratamiento' })
    @Column()
    duracion_tratamiento: string;

    @ApiProperty({ example: 'Tomar con alimentos', description: 'Instrucciones adicionales' })
    @Column()
    instrucciones: string;

    @ManyToOne(() => Receta, receta => receta.detallesReceta)
    receta: Receta;

    @ManyToOne(() => Producto, producto => producto.detallesReceta)
    producto: Producto;

    @OneToMany(() => DetallePrescripcion, detallePrescripcion => detallePrescripcion.detalleReceta)
    detallesPrescripcion: DetallePrescripcion[];
}
