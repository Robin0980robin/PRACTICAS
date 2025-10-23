import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int, { description: 'Número de página (1-based)' })
  page = 1;

  @Field(() => Int, { description: 'Tamaño de página' })
  pageSize = 10;
}
