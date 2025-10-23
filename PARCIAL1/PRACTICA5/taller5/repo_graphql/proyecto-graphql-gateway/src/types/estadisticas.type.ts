import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EstadisticasVentasType {
  @Field(() => Int)
  mes: number;

  @Field(() => Int)
  anio: number;

  @Field(() => Float)
  totalVentas: number;

  @Field(() => Int)
  numeroVentas: number;

  @Field(() => Float)
  promedioVentaDiaria: number;

  @Field(() => Float)
  ventaMaxima: number;

  @Field(() => Float)
  ventaMinima: number;

  @Field(() => Float)
  variacionPorcentual: number;
}