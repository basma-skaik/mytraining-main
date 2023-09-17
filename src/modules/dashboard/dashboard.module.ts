import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardProvider } from './dashboard.provider';

@Module({
  providers: [DashboardService, ...DashboardProvider],
  exports: [DashboardService],
})
export class DashboardModule {}
