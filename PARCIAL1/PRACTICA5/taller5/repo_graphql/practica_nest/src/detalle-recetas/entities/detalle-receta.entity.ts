import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Receta } from '../../recetas/entities/receta.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { DetallePrescripcion } from 'src/detalle-prescripciones/entities/detalle-prescripcion.entity';

@Entity('detalle_recetas')
export class DetalleReceta {
    @PrimaryGeneratedColumn()
    id_detalle_receta: number;

    @Column()
    cantidad: number;

    @Column()
    dosis: string;

    @Column()
    presentacion: string;

    @Column()
    duracion_tratamiento: string;

    @Column()
    instrucciones: string;

    @ManyToOne(() => Receta, receta => receta.detallesReceta)
    receta: Receta;

    @ManyToOne(() => Producto, producto => producto.detallesReceta)
    producto: Producto;

    @OneToMany(() => DetallePrescripcion, detallePrescripcion => detallePrescripcion.detalleReceta)
    detallesPrescripcion: DetallePrescripcion[];
}
