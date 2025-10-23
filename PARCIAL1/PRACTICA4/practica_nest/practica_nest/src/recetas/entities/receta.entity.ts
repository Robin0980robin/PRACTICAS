import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Medico } from '../../medicos/entities/medico.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { DetalleReceta } from '../../detalle-recetas/entities/detalle-receta.entity';

@Entity('recetas')
export class Receta {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Identificador único de la receta' })
    id_receta: number;

    @ApiProperty({ example: '2025-10-15', description: 'Fecha de emisión de la receta' })
    @Column({ type: 'date' })
    fecha_emision: Date;

    @ApiProperty({ example: 'Gripe', description: 'Diagnóstico asociado a la receta' })
    @Column()
    diagnostico: string;

    @ApiProperty({ example: 'Tomar con alimentos', description: 'Observaciones de la receta' })
    @Column()
    observaciones: string;

    @ApiProperty({ example: 'Hospital Central', description: 'Ubicación donde se emitió la receta' })
    @Column()
    ubicacion_emision: string;

    @ManyToOne(() => Medico, medico => medico.recetas)
    medico: Medico;

    @ManyToOne(() => Paciente, paciente => paciente.recetas)
    paciente: Paciente;

    @OneToMany(() => DetalleReceta, detalleReceta => detalleReceta.receta)
    detallesReceta: DetalleReceta[];
}
