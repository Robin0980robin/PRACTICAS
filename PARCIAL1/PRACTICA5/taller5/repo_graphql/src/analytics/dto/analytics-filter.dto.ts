import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Description } from '../../common/decorators/description.decorator';

@InputType()
@Description('Filters for analytics queries, allowing for specific data analysis based on various criteria.')
export class AnalyticsFilterDto {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @Description('The category of data to filter by, e.g., "recetas", "medicos", etc.')
    category?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    @Description('The ID of the entity to filter by, such as a specific medico or paciente ID.')
    entityId?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    @Description('The start date for the analysis period.')
    startDate?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    @Description('The end date for the analysis period.')
    endDate?: string;
}