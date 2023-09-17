import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { DashboardInvitationService } from './dashboard-invitation.service';
import { TransactionInterceptor } from 'src/common/interceptors';
import { TransactionParam, User } from 'src/common/decorator';
import { Transaction } from 'sequelize';

@Controller('dashboardInvitation')
export class DashboardInvitationController {
  constructor(
    private readonly dashboardInvitationService: DashboardInvitationService,
  ) {}

  @Post('dashboard/:dashboardId/invite')
  @UseInterceptors(TransactionInterceptor)
  async inviteUserToDashboard(
    @Param('dashboardId') dashboardId: number,
    @Body() body: { invitedUserIds: number[] },
    @User() user,
    @TransactionParam() transaction: Transaction,
  ) {
    return await this.dashboardInvitationService.inviteUserToDashboard(
      dashboardId,
      body.invitedUserIds,
      user.id,
      transaction,
    );
  }

  @Post('respond/:invitationId')
  @UseInterceptors(TransactionInterceptor)
  async respondToDashboardInvitation(
    @Param('invitationId') invitationId: number,
    @Body('response') response: string,
    @User() user,
    @TransactionParam() transaction: Transaction,
  ) {
    return await this.dashboardInvitationService.respondToDashboardInvitation(
      invitationId,
      response,
      user.id,
      transaction,
    );
  }
}
