import { Resolver, Query, Args } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import { KpiResultType } from './types/kpi-result.type';
import { TrendType } from './types/trend.type';
import { ReportType } from './types/report.type';
import { KpiInputDto } from './dto/kpi-input.dto';
import { TimeRangeDto } from './dto/time-range.dto';
import { AnalyticsFilterDto } from './dto/analytics-filter.dto';
import { Description } from '../common/decorators/description.decorator';

@Resolver()
export class AnalyticsResolver {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Query(() => KpiResultType)
    @Description('Calculates KPIs based on the provided input parameters.')
    async calculateKpi(@Args('input') input: KpiInputDto): Promise<KpiResultType> {
        return this.analyticsService.calculateKpi(input);
    }

    @Query(() => [TrendType])
    @Description('Analyzes trends over a specified time range.')
    async analyzeTrends(@Args('timeRange') timeRange: TimeRangeDto): Promise<TrendType[]> {
        return this.analyticsService.analyzeTrends(timeRange);
    }

    @Query(() => ReportType)
    @Description('Generates an analytical report based on filters and parameters.')
    async generateReport(@Args('filters') filters: AnalyticsFilterDto): Promise<ReportType> {
        return this.analyticsService.generateReport(filters);
    }
}