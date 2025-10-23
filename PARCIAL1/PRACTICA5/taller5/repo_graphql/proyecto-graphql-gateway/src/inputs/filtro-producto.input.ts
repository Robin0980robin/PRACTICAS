// src/inputs/filtro-producto.input.ts
import { InputType, Field, Int, Float } from '@nestjs/graphql';
@InputType()
export class FiltroProductoInput {
 @Field({ nullable: true })
 nombre?: string;
 @Field(() => Int, { nullable: true })
 categoriaId?: number;
 @Field(() => Float, { nullable: true })
 precioMin?: number;
 @Field(() => Float, { nullable: true })
 precioMax?: number;
 @Field(() => Int, { nullable: true })
 stockMin?: number;
}