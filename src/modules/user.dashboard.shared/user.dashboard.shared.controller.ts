import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionParam, User } from 'src/common/decorator';
import { UserDashboardSharedService } from './user.dashboard.shared.service';
import { Transaction } from 'sequelize';
import { TransactionInterceptor } from 'src/common/interceptors';

@Controller('userDashboardShared')
export class userDashboardSharedController {
  constructor(private userDashboardSharedService: UserDashboardSharedService) {}

  @Get('shared')
  async getSharedDashboards(@User() user) {
    const sharedDashboards =
      await this.userDashboardSharedService.getSharedDashboards(user.id);
    return { sharedDashboards };
  }

  @Delete('user/:userId/dashboard/:dashboardId')
  @UseInterceptors(TransactionInterceptor)
  async removeSharedUser(
    @User() owner,
    @Param('userId') userId: number,
    @Param('dashboardId') dashboardId: number,
    @TransactionParam() transaction: Transaction,
  ) {
    return await this.userDashboardSharedService.removeSharedUser(
      owner.id,
      userId,
      dashboardId,
      transaction,
    );
  }

  @Patch('user/:userId/dashboard/:dashboardId')
  @UseInterceptors(TransactionInterceptor)
  async changeUserRoleInDashboard(
    @Param('userId') userId: number,
    @Param('dashboardId') dashboardId: number,
    @Body('role') role: string,
    @User() user,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.userDashboardSharedService.changeUserRoleInDashboard(
      userId,
      dashboardId,
      role,
      user.id,
      transaction,
    );
  }
}
