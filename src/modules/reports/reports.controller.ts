import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { Public, User } from 'src/common/decorator';
import { Role } from 'src/common/constants';
import { Roles } from 'src/common/decorator/roles.decorator';


@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Roles(Role.User)
  @Post()
  createReport(@Body() createReportDto: CreateReportDto, @User() user) {
    return this.reportService.create(createReportDto ,user.id);
  }

  @Roles(Role.User)
  @Public()
  @Get()
  findAllReports() {
    return this.reportService.findAll();
  }

  @Roles(Role.User)
  @Get(':id')
  findReport(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }

  @Roles(Role.User)
  @Patch(':id')
  updateReport(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
    @User() user
  ) {
    return this.reportService.update(+id, updateReportDto, user.id);
  }

  @Delete(':id')
  deleteReport(@Param('id') id: string,  @User() user) {
    return this.reportService.remove(+id, user.id);
  }

  @Get('dashboard/:id/reports')
  async getDashboardReports(@Param('id') dashboardId: number) {
    const reports = await this.reportService.getDashboardReports(
      dashboardId,
    );
    return { reports };
  }

  @Patch('dashboard/:dashboardId/reports/:reportId')
  async updateDashboardReport(
    @Param('dashboardId') dashboardId: number,
    @Param('reportId') reportId: number,
    @Body() updateReportDto: UpdateReportDto,
    @User() user,
  ) {
    const updatedReport = await this.reportService.updateDashboardReport(
      dashboardId,
      reportId,
      updateReportDto,
      user.id,
    );
    return { updatedReport };
  }
}
