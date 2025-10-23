import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Description } from '../../common/decorators/description.decorator';

@ObjectType()
@Description('Represents the result of a Key Performance Indicator (KPI) analysis')
export class KpiResultType {
    @Field(() => String)
    @Description('The name of the KPI')
    name: string;

    @Field(() => Float)
    @Description('The calculated value of the KPI')
    value: number;

    @Field(() => String)
    @Description('The time period for which the KPI is calculated')
    period: string;

    @Field(() => String)
    @Description('Any additional notes or comments regarding the KPI result')
    notes?: string;
}