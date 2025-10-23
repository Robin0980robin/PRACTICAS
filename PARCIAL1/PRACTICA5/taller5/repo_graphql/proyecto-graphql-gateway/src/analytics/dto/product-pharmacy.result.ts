import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Resultado combinado de producto y sucursal/farmacia' })
export class ProductPharmacyResult {
  @Field(() => Int)
  productId: number;

  @Field()
  productName: string;

  @Field()
  pharmacyName: string;

  @Field()
  pharmacyAddress: string;

  @Field(() => Int)
  price: number;
}
