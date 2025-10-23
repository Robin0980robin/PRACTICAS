import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoriaType {
  @Field(() => ID)
  id: number;

  @Field()
  nombre: string;

  @Field()
  descripcion: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

