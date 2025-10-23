import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Sucursal } from '../../sucursales/entities/sucursal.entity';
import { DetallePrescripcion } from '../../detalle-prescripciones/entities/detalle-prescripcion.entity';
import { Busqueda } from '../../busquedas/entities/busqueda.entity';

@Entity('farmacias')
export class Farmacia {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Identificador de la farmacia' })
    id_farmacia: number;

    @ApiProperty({ example: 'Farmacia ABC', description: 'Nombre comercial de la farmacia' })
    @Column()
    nombre_comercial: string;

    @ApiProperty({ example: '08:00-20:00', description: 'Horario de atención' })
    @Column()
    horario_atencion: string;

    @OneToMany(() => Sucursal, sucursal => sucursal.farmacia)
    sucursales: Sucursal[];

    @OneToMany(() => DetallePrescripcion, detallePrescripcion => detallePrescripcion.farmacia)
    detallesPrescripcion: DetallePrescripcion[];

    @OneToMany(() => Busqueda, busqueda => busqueda.farmacia)
    busquedas: Busqueda[];
}
