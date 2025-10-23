import { IsDateString, IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Description } from '../../common/decorators/description.decorator';

@InputType()
@Description('DTO for specifying a time range for analytics queries')
export class TimeRangeDto {
    @Field()
    @IsNotEmpty()
    @IsDateString()
    @Description('Start date of the time range')
    startDate: string;

    @Field()
    @IsNotEmpty()
    @IsDateString()
    @Description('End date of the time range')
    endDate: string;
}