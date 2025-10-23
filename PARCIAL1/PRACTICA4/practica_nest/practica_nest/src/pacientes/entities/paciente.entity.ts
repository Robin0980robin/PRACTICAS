import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Receta } from '../../recetas/entities/receta.entity';

@Entity('pacientes')
export class Paciente {
    @ApiProperty({ example: 1, description: 'Identificador único del paciente' })
    @PrimaryGeneratedColumn()
    id_paciente: number;

    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del paciente' })
    @Column()
    nombre: string;

    @ApiProperty({ example: '1990-01-01', description: 'Fecha de nacimiento del paciente' })
    @Column({ type: 'date' })
    fecha_nacimiento: Date;

    @ApiProperty({ example: '1234567890', description: 'Número de cédula del paciente' })
    @Column()
    cedula: string;

    @ApiProperty({ example: 'Calle Principal #123', description: 'Dirección del paciente' })
    @Column()
    direccion: string;

    @ApiProperty({ example: '0991234567', description: 'Número de teléfono del paciente' })
    @Column()
    telefono: string;

    @OneToOne(() => Usuario)
    @JoinColumn()
    usuario: Usuario;

    @OneToMany(() => Receta, receta => receta.paciente)
    recetas: Receta[];
}
