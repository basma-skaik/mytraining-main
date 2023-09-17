import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportProvider } from './reports.provider';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [DashboardModule],
  controllers: [ReportsController],
  providers: [ReportsService, ...ReportProvider],
  exports: [ReportsService],
})
export class ReportsModule {}
