import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Usuario } from './usuario.type';

@ObjectType()
export class Paciente {
    @Field(() => ID)
    id_paciente: number;

    @Field()
    nombre: string;

    @Field()
    fecha_nacimiento: Date;

    @Field()
    cedula: string;

    @Field()
    direccion: string;

    @Field()
    telefono: string;

    @Field(() => Usuario, { nullable: true })
    usuario?: Usuario;
}