import { ObjectType, Field } from '@nestjs/graphql';
import { Description } from '../../common/decorators/description.decorator';

@ObjectType()
@Description('Represents the trend analysis results for various metrics over a specified time period.')
export class TrendType {
    @Field()
    @Description('The name of the metric being analyzed.')
    metricName: string;

    @Field(() => [Number])
    @Description('An array of values representing the metric over time.')
    values: number[];

    @Field(() => [String])
    @Description('An array of timestamps corresponding to the values.')
    timestamps: string[];

    @Field()
    @Description('The calculated average value of the metric over the specified time period.')
    average: number;

    @Field()
    @Description('The maximum value of the metric during the specified time period.')
    max: number;

    @Field()
    @Description('The minimum value of the metric during the specified time period.')
    min: number;
}