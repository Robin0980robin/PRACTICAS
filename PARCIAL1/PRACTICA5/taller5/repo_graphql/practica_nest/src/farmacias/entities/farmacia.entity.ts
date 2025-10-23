import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sucursal } from 'src/sucursales/entities/sucursal.entity';
import { DetallePrescripcion } from '../../detalle-prescripciones/entities/detalle-prescripcion.entity';
import { Busqueda } from '../../busquedas/entities/busqueda.entity';

@Entity('farmacias')
export class Farmacia {
    @PrimaryGeneratedColumn()
    id_farmacia: number;

    @Column()
    nombre_comercial: string;

    @Column()
    horario_atencion: string;

    @OneToMany(() => Sucursal, sucursal => sucursal.farmacia)
    sucursales: Sucursal[];

    @OneToMany(() => DetallePrescripcion, detallePrescripcion => detallePrescripcion.farmacia)
    detallesPrescripcion: DetallePrescripcion[];

    @OneToMany(() => Busqueda, busqueda => busqueda.farmacia)
    busquedas: Busqueda[];
}
