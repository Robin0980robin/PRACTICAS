import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Ranking de médicos por número de recetas o prescripciones' })
export class TopDoctor {
  @Field(() => Int)
  doctorId: number;

  @Field()
  doctorName: string;

  @Field(() => Int)
  prescriptionsCount: number;
}

@ObjectType({ description: 'Resultado para top médicos con paginación' })
export class TopDoctorsResult {
  @Field(() => [TopDoctor])
  items: TopDoctor[];

  @Field(() => Int)
  total: number;
}
