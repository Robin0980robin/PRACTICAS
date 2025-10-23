import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Farmacia } from '../../farmacias/entities/farmacia.entity';

@Entity('sucursales')
export class Sucursal {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Identificador de la sucursal' })
    id_sucursal: number;

    @ApiProperty({ example: -70.12345, description: 'Longitud geográfica de la sucursal' })
    @Column('float')
    longitud: number;

    @ApiProperty({ example: -33.45678, description: 'Latitud geográfica de la sucursal' })
    @Column('float')
    latitud: number;

    @ManyToOne(() => Farmacia, farmacia => farmacia.sucursales)
    farmacia: Farmacia;
}