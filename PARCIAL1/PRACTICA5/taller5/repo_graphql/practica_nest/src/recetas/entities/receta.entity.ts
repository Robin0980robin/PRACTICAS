import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Medico } from '../../medicos/entities/medico.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { DetalleReceta } from '../../detalle-recetas/entities/detalle-receta.entity';

@Entity('recetas')
export class Receta {
    @PrimaryGeneratedColumn()
    id_receta: number;

    @Column({ type: 'date' })
    fecha_emision: Date;

    @Column()
    diagnostico: string;

    @Column()
    observaciones: string;

    @Column()
    ubicacion_emision: string;

    @ManyToOne(() => Medico, medico => medico.recetas)
    medico: Medico;

    @ManyToOne(() => Paciente, paciente => paciente.recetas)
    paciente: Paciente;

    @OneToMany(() => DetalleReceta, detalleReceta => detalleReceta.receta)
    detallesReceta: DetalleReceta[];
}
