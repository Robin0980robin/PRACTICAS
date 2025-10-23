import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Medico } from './medico.type';
import { Paciente } from './paciente.type';

@ObjectType()
export class Receta {
    @Field(() => ID)
    id_receta: number;

    @Field()
    fecha_emision: Date;

    @Field()
    diagnostico: string;

    @Field()
    observaciones: string;

    @Field()
    ubicacion_emision: string;

    @Field(() => Medico)
    medico: Medico;

    @Field(() => Paciente)
    paciente: Paciente;
}