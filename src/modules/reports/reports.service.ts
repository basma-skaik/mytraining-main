import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Reports } from './report.model';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { REPOSITORIES } from 'src/common/constants';
import { Users } from '../users/user.model';
import { CustomLogger } from 'src/common/loggers/winston.logger';
import { DashboardService } from '../dashboard/dashboard.service';
import { CheckItemExistance } from 'src/common/utils';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(REPOSITORIES.REPORT_REPOSITORY)
    private reportRepository: typeof Reports,
    private dashboardService: DashboardService,
  ) {}

  private readonly logger = new CustomLogger();

  async create(createReportDto: CreateReportDto, userId: number) {
    const dashboard = await this.dashboardService.findOne(userId);

    CheckItemExistance(dashboard, 'Dashboard not found for the specified userId')

    const report = await this.reportRepository.create({
      ...createReportDto,
      dashboardId: dashboard.id,
      createdBy: userId,
      createdAt: new Date(),
    });

    this.logger.log(`Attempting to create report with userId ${userId}`);
    return report;
  }

  async findAll() {
    const reports = await this.reportRepository.findAll({
      include: Users,
    });

    CheckItemExistance(reports, 'Reports not found!');

    this.logger.log(`Attempting to find all reports`);
    return reports;
  }

  async findAllByUserId(userId: number) {
    return this.reportRepository.findAll({
      where: { userId },
    });
  }

  async findOne(id: number) {
    const report = await this.reportRepository.findOne({
      where: { id },
      include: Users,
    });

    CheckItemExistance(report, 'Report not found!');

    this.logger.log(`Attempting to find report with id ${id}`);
    return report;
  }

  async update(id: number, attrs: UpdateReportDto, userId: number) {
    const report = await this.reportRepository.findOne({ where: { id } });

    CheckItemExistance(report, 'Report not found!');

    await report.update({
      ...attrs,
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(`Attempting to update report with id ${id}`);
    return report;
  }

  async remove(id: number, userId: number) {
    const report = await this.reportRepository.findOne({ where: { id } });

    CheckItemExistance(report, 'Report not found!');

    // Perform soft delete
    report.deletedAt = new Date();
    report.deletedBy = userId;
    this.logger.log(`Attempting to remove report with id ${id}`);
    return report.save();
  }

  async getDashboardReports(dashboardId: number) {
    const reports = await this.reportRepository.findOne({
      where: { dashboardId },
    });

    this.logger.log(`Attempting to get all dashboard reports`);
    return reports;
  }

  async updateDashboardReport(
    dashboardId: number,
    reportId: number,
    updateReportDto: UpdateReportDto,
    userId: number,
  ) {
    const dashboard = await this.dashboardService.findDashboardById(
      dashboardId,
    );

    CheckItemExistance(dashboard, 'Dashboard not found!');

    const report = await this.reportRepository.findOne({
      where: { id: reportId },
    });
    CheckItemExistance(report, 'Report not found!');

    // Perform the update of the report with the data from the UpdateReportDto
    const updatedReport = await report.update({
      ...updateReportDto, // Include the updated data from the UpdateReportDto
      updatedBy: userId,
      updatedAt: new Date(),
    });

    this.logger.log(`Attempting to update reports in dashboard`);
    return updatedReport;
  }
}
