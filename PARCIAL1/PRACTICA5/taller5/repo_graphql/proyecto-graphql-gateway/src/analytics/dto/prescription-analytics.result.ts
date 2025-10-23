import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Estadísticas agregadas sobre recetas y prescripciones' })
export class PrescriptionAnalyticsResult {
  @Field(() => Int)
  totalPrescriptions: number;

  @Field(() => Int)
  totalPrescribedItems: number;

  @Field()
  periodStart: string;

  @Field()
  periodEnd: string;
}
