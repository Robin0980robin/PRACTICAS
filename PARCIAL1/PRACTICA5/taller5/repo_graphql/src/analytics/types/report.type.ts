import { ObjectType, Field } from '@nestjs/graphql';
import { Description } from '../../common/decorators/description.decorator';

@ObjectType()
@Description('Represents an analytical report generated from various data sources.')
export class ReportType {
    @Field()
    @Description('The title of the report.')
    title: string;

    @Field()
    @Description('The date when the report was generated.')
    generatedAt: Date;

    @Field(() => [String])
    @Description('A list of key performance indicators included in the report.')
    kpis: string[];

    @Field(() => [String])
    @Description('A summary of findings or insights derived from the data analysis.')
    insights: string[];

    @Field(() => [String])
    @Description('The data sources used to generate the report.')
    dataSources: string[];

    @Field()
    @Description('The overall conclusion drawn from the report.')
    conclusion: string;
}