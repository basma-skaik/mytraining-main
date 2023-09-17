import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES } from 'src/common/constants';
import { DashboardInvitation } from './dashboard-invitation.model';
import { UserDashboardSharedService } from '../user.dashboard.shared/user.dashboard.shared.service';
import { CheckItemExistance, checkItemDuplicate } from 'src/common/utils';
import { CustomLogger } from 'src/common/loggers/winston.logger';

@Injectable()
export class DashboardInvitationService {
  constructor(
    @Inject(REPOSITORIES.DASHBOARD_INVITATION_REPOSITORY)
    private dashboardInvitationRepository: typeof DashboardInvitation,
    private readonly userDashboardSharedService: UserDashboardSharedService,
  ) {}

  private readonly logger = new CustomLogger();

  async inviteUserToDashboard(
    dashboardId: number,
    invitedUserIds: number[],
    invitingUserId: number,
    transaction: any,
  ) {
    // Check if there is an owner for the specified dashboard
    const ownerExists = await this.userDashboardSharedService.findOwner(
      dashboardId,
    );

    if (!ownerExists) {
      // If no owner exists, insert the owner into UserDashboardShared as an owner
      await this.userDashboardSharedService.shareDashboardWithUser(
        dashboardId,
        invitingUserId, // Owner's ID
        invitingUserId, // Owner's ID
        transaction,
      );
    }

    await this.userDashboardSharedService.checkOwnerPrivilege(
      invitingUserId,
      dashboardId,
    );

    const promises = invitedUserIds.map(async (invitedUserId) => {
      const existingInvitation =
        await this.dashboardInvitationRepository.findOne({
          where: {
            dashboardId,
            invitedUserId,
            status: 'pending',
          },
        });
        
      checkItemDuplicate(
        existingInvitation,
        `An invitation for user with ID ${invitedUserId} already exists!`,
      );

      await this.dashboardInvitationRepository.create(
        {
          dashboardId,
          invitedUserId,
          invitingUserId,
          status: 'pending',
        },
        { transaction },
      );
    });

    await Promise.allSettled(promises);
    this.logger.log(`Inviting user to join the dashboard`);
    return { message: 'Invitation sent successfully' };
  }

  async respondToDashboardInvitation(
    invitationId: number,
    response: string,
    userId: number,
    transaction: any,
  ) {
    const invitation = await this.dashboardInvitationRepository.findOne({
      where: { id: invitationId },
    });

    CheckItemExistance(invitation);

    if (invitation.invitedUserId !== userId) {
      throw new HttpException(
        'You are not authorized to respond to this invitation',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (invitation.status !== 'pending') {
      throw new HttpException(
        'This invitation has already been responded to',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (response === 'accept') {
      await this.userDashboardSharedService.shareDashboardWithUser(
        invitation.dashboardId,
        userId,
        invitation.invitingUserId,
        transaction,
      );
      invitation.status = 'accepted';
    } else if (response === 'decline') {
      invitation.status = 'declined';
    }

    await invitation.save({ transaction });
    return invitation;
  }
}
