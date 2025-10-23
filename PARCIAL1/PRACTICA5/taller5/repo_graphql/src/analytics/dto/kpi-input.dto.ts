import { InputType, Field } from '@nestjs/graphql';
import { Description } from '../../common/decorators/description.decorator';

@InputType()
@Description('Input data for KPI calculations, including parameters for analysis.')
export class KpiInputDto {
    @Field()
    @Description('The ID of the medico to analyze.')
    medicoId: number;

    @Field()
    @Description('The ID of the paciente to analyze.')
    pacienteId: number;

    @Field()
    @Description('The start date for the analysis period.')
    startDate: Date;

    @Field()
    @Description('The end date for the analysis period.')
    endDate: Date;

    @Field({ nullable: true })
    @Description('Optional filter for specific types of KPIs.')
    kpiType?: string;
}