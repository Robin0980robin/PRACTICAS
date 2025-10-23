import { Field, ID, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VentaType {
  @Field(() => ID)
  id: number;

  @Field(() => Float)
  total: number;

  @Field()
  fecha: Date;

  @Field(() => ID)
  userId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}