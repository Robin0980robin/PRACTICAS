import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetalleReceta } from '../../detalle-recetas/entities/detalle-receta.entity';
import { DetallePrescripcion } from 'src/detalle-prescripciones/entities/detalle-prescripcion.entity';

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn()
    id_producto: number;

    @Column()
    nombre_generico: string;

    @Column()
    nombre_comercial: string;

    @Column()
    principio_activo: string;

    @Column()
    categoria: string;

    @Column()
    presentacion: string;

    @Column()
    concentracion: string;

    @Column()
    requiere_receta: boolean;

    @OneToMany(() => DetalleReceta, detalleReceta => detalleReceta.producto)
    detallesReceta: DetalleReceta[];

    @OneToMany(() => DetallePrescripcion, detallePrescripcion => detallePrescripcion.producto)
    detallesPrescripcion: DetallePrescripcion[];
}
