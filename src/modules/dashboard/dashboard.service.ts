import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES } from 'src/common/constants';
import { Dashboard } from './dashboard.model';
import { CustomLogger } from 'src/common/loggers/winston.logger';
import { CreateDashboardDto } from './dtos/create-dashboard.dto';
import { CheckItemExistance, checkItemDuplicate } from 'src/common/utils';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(REPOSITORIES.DASHBOARD_REPOSITORY)
    private dashboardRepository: typeof Dashboard,
  ) {}

  private readonly logger = new CustomLogger();

  async getOrCreate(
    createDashboardDto: CreateDashboardDto,
    userId: number,
    transaction: any,
  ) {
    // Check if the user already has a dashboard due to one-one relation
    const existingDashboard = await this.dashboardRepository.findOne({
      where: { userId },
    });

    checkItemDuplicate(existingDashboard, 'User already has a dashboard!');

    const dashboard = await this.dashboardRepository.create(
      {
        ...createDashboardDto,
        userId: userId,
        createdBy: userId,
        createdAt: new Date(),
      },
      { transaction },
    );

    this.logger.log(
      `Attempting to create dashboard with title ${createDashboardDto.title}`,
    );
    return dashboard;
  }

  async findOne(userId: number) {
    const dashboard = await this.dashboardRepository.findOne({
      where: { userId },
    });

    CheckItemExistance(dashboard, 'Dashboard not found!');

    return dashboard;
  }

  async findDashboardById(dashboardId: number, include?: any) {
    const dashboard = await this.dashboardRepository.findByPk(dashboardId);
    CheckItemExistance(dashboard);
    return dashboard;
  }

  async findDashboardsByIds(dashboardIds: number[]) {
    return this.dashboardRepository.findAll({
      where: { id: dashboardIds },
    });
  }
}
