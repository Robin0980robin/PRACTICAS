import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Farmacia } from '../../farmacias/entities/farmacia.entity';

@Entity('sucursales')
export class Sucursal {
    @PrimaryGeneratedColumn()
    id_sucursal: number;

    @Column('float')
    longitud: number;

    @Column('float')
    latitud: number;

    @ManyToOne(() => Farmacia, farmacia => farmacia.sucursales)
    farmacia: Farmacia;
}