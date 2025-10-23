import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
@ObjectType()
export class ProductoType {
 @Field(() => Int)
 id: number;
 @Field()
 nombre: string;
 @Field()
 descripcion: string;
 @Field(() => Float)
 precio: number;
 @Field(() => Int)
 stock: number;
 @Field(() => Int)
 categoriaId: number;
 // Relaciones con otras entidades
 @Field(() => CategoriaType, { nullable: true })
 categoria?: CategoriaType;
}
@ObjectType()
export class CategoriaType {
 @Field(() => Int)
 id: number;
 @Field()
 nombre: string;
 @Field()
 descripcion: string;
}