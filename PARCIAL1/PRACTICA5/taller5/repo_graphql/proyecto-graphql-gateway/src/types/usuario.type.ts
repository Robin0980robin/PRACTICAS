import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Usuario {
    @Field(() => ID)
    id_usuario: number;

    @Field()
    nombre: string;

    @Field()
    apellido: string;

    @Field()
    email: string;

    @Field()
    tipo_usuario: string;

    @Field()
    fecha_registro: Date;

    @Field()
    estado: string;
}