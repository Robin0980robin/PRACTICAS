import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DetalleReceta } from '../../detalle-recetas/entities/detalle-receta.entity';
import { Farmacia } from '../../farmacias/entities/farmacia.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_prescripciones')
export class DetallePrescripcion {
    @PrimaryGeneratedColumn()
    id_detalle_prescripcion: number;

    @Column('decimal', { precision: 10, scale: 2 })
    precio_encontrado: number;

    @Column('float')
    distancia: number;

    @Column({ type: 'date' })
    fecha_consulta: Date;

    @Column()
    fuente: string;

    @ManyToOne(() => DetalleReceta, detalleReceta => detalleReceta.detallesPrescripcion)
    detalleReceta: DetalleReceta;

    @ManyToOne(() => Farmacia, farmacia => farmacia.detallesPrescripcion)
    farmacia: Farmacia;

    @ManyToOne(() => Producto, producto => producto.detallesPrescripcion)
    producto: Producto;
}