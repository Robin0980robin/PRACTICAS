import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Usuario } from './usuario.type';

@ObjectType()
export class Medico {
    @Field(() => ID)
    id_medico: number;

    @Field()
    numero_licencia: string;

    @Field()
    institucion: string;

    @Field()
    ubicacion_consultorio: string;

    @Field(() => Usuario, { nullable: true })
    usuario?: Usuario;
}