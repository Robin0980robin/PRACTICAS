import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Medico } from '../../medicos/entities/medico.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Busqueda } from '../../busquedas/entities/busqueda.entity';

@Entity('usuarios')
export class Usuario {
    @ApiProperty({ example: 1, description: 'Identificador único del usuario' })
    @PrimaryGeneratedColumn()
    id_usuario: number;

    @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
    @Column()
    nombre: string;

    @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
    @Column()
    apellido: string;

    @ApiProperty({ example: 'juan@example.com', description: 'Correo electrónico del usuario' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ example: '********', description: 'Contraseña del usuario' })
    @Column()
    contraseña: string;

    @ApiProperty({ example: 'medico', description: 'Tipo de usuario (medico, paciente, admin)' })
    @Column()
    tipo_usuario: string;

    @ApiProperty({ example: '2023-01-01', description: 'Fecha de registro del usuario' })
    @Column({ type: 'date' })
    fecha_registro: Date;

    @ApiProperty({ example: 'activo', description: 'Estado del usuario (activo, inactivo)' })
    @Column()
    estado: string;

    @OneToOne(() => Medico, medico => medico.usuario)
    medico: Medico;

    @OneToOne(() => Paciente, paciente => paciente.usuario)
    paciente: Paciente;

    @OneToMany(() => Busqueda, busqueda => busqueda.usuario)
    busquedas: Busqueda[];
}