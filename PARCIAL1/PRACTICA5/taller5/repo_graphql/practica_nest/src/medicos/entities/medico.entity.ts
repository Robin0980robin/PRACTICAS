import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Receta } from '../../recetas/entities/receta.entity';

@Entity('medicos')
export class Medico {
    @ApiProperty({ example: 1, description: 'Identificador único del médico' })
    @PrimaryGeneratedColumn()
    id_medico: number;

    @ApiProperty({ example: 'MED-12345', description: 'Número de licencia médica' })
    @Column()
    numero_licencia: string;

    @ApiProperty({ example: 'Hospital Central', description: 'Institución donde trabaja el médico' })
    @Column()
    institucion: string;

    @ApiProperty({ example: 'Calle Principal #123', description: 'Ubicación del consultorio' })
    @Column()
    ubicacion_consultorio: string;

    @OneToOne(() => Usuario)
    @JoinColumn()
    usuario: Usuario;

    @OneToMany(() => Receta, receta => receta.medico)
    recetas: Receta[];
}
