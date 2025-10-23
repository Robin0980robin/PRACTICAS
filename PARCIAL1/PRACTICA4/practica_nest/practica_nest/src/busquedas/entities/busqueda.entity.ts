import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Farmacia } from '../../farmacias/entities/farmacia.entity';

@Entity('busquedas')
export class Busqueda {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Identificador de la búsqueda' })
    id_busqueda: number;

    @ApiProperty({ example: 'paracetamol 500', description: 'Término que buscó el usuario' })
    @Column()
    termino_busqueda: string;

    @ApiProperty({ example: '2025-10-15T12:34:56', description: 'Fecha y hora de la búsqueda' })
    @Column({ type: 'datetime' })
    fecha_hora: Date;

    @ApiProperty({ example: '10 resultados', description: 'Resumen de resultados mostrados' })
    @Column()
    resultados_mostrados: string;

    @ApiProperty({ example: 'Farmacia ABC', description: 'Farmacia seleccionada por el usuario' })
    @Column()
    farmacia_seleccionada: string;

    @Column()
    geolocalizacion: string;

    @ManyToOne(() => Usuario, usuario => usuario.busquedas)
    usuario: Usuario;

    @ManyToOne(() => Farmacia, farmacia => farmacia.busquedas)
    farmacia: Farmacia;
}
