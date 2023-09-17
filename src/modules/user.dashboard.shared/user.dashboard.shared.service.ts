import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REPOSITORIES, Role } from 'src/common/constants';
import { UserDashboardShared } from './user.dashboard.shared.model';
import { CustomLogger } from 'src/common/loggers/winston.logger';
import { ConversationService } from '../conversation/conversation.service';
import { CheckItemExistance } from 'src/common/utils';
import { UsersService } from '../users/users.service';
import { DashboardService } from '../dashboard/dashboard.service';

@Injectable()
export class UserDashboardSharedService {
  constructor(
    @Inject(REPOSITORIES.USER_DASHBOARD_REPOSITORY)
    private userDashboardSharedRepository: typeof UserDashboardShared,
    private readonly conversationService: ConversationService,
    private usersService: UsersService,
    private dashboardService: DashboardService,
  ) {}

  private readonly logger = new CustomLogger();

  async shareDashboardWithUser(
    dashboardId: number,
    userIdToShareWith: number,
    userIdSignIn: number,
    transaction: any,
  ) {
    const dashboard = await this.dashboardService.findDashboardById(
      dashboardId,
    );

    const existingOwner = await this.userDashboardSharedRepository.findOne({
      where: {
        dashboardId,
        role: 'owner',
      },
    });

    if (!existingOwner) {
      // If no owner exists, create an owner entry
      await this.userDashboardSharedRepository.create(
        {
          userId: userIdSignIn,
          dashboardId: dashboardId,
          role: Role.Owner,
        },
        { transaction },
      );
    }

    const user = await this.userDashboardSharedRepository.findOne({
      where: { userId: userIdSignIn },
    });
    await this.checkOwnerPrivilege(user.userId, dashboardId);

    // Check if the user to share with exists
    const userToShareWith = await this.usersService.findOne(userIdToShareWith);

    CheckItemExistance(userToShareWith);

    // Skip adding the userSignIn as a shared user since they are the owner
    if (userIdToShareWith !== userIdSignIn) {
      await dashboard.$add('sharedWithUsers', userToShareWith, {
        through: { role: 'user' },
        transaction,
      });
    }

    this.logger.log(`Sharing dashboard with user ${userIdToShareWith}`);
    return dashboard;
  }

  async getSharedDashboards(userId: number) {
    // Find all records in UserDashboardShared where userId matches
    const sharedDashboardRecords =
      await this.userDashboardSharedRepository.findAll({
        where: { userId },
      });

    const dashboardIds = sharedDashboardRecords.map(
      (record) => record.dashboardId,
    );

    // Find the dashboards corresponding to the retrieved IDs
    const sharedDashboards = await this.dashboardService.findDashboardsByIds(
      dashboardIds,
    );

    this.logger.log(`Attempting to get shared dashboard with other users`);
    return sharedDashboards;
  }

  async getSharedUserIdsByDashboardId(dashboardId: number) {
    const sharedUserIds = await this.userDashboardSharedRepository.findAll({
      attributes: ['userId'],
      where: { dashboardId },
    });

    CheckItemExistance(sharedUserIds, 'SharedUserIds not found!');

    const userIds = sharedUserIds.map(({ userId }) => userId);

    return userIds;
  }

  //any user can leave the dashboard shared also the owner and the groupAdmin can remove user
  async removeSharedUser(
    ownerId: number,
    userId: number,
    dashboardId: number,
    transaction: any,
  ) {
    const user = await this.userDashboardSharedRepository.findOne({
      where: { userId },
    });

    if (user.role === 'owner') {
      throw new HttpException(
        'Owners cannot be removed from the dashboard!',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.conversationService.removeSharedUserConversations(
      ownerId,
      userId,
      transaction,
    );
    const sharedUser = await this.userDashboardSharedRepository.findOne({
      where: {
        userId: userId,
        dashboardId: dashboardId,
      },
      transaction,
    });

    CheckItemExistance(sharedUser, 'SharedUserId not found!');

    sharedUser.deletedAt = new Date();
    sharedUser.deletedBy = ownerId;

    this.logger.log(`Attempting to remove shared user with id ${userId}`);

    await sharedUser.save();

    return sharedUser;
  }

  async changeUserRoleInDashboard(
    userId: number,
    dashboardId: number,
    role: any,
    userIdSignIn: number,
    transaction: any,
  ) {
    const user = await this.userDashboardSharedRepository.findOne({
      where: { userId },
    });

    if (user.role === 'owner') {
      throw new HttpException(
        'Owners cannot be changed in the dashboard!',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.checkOwnerPrivilege(userIdSignIn, dashboardId);

    await this.userDashboardSharedRepository.update(
      { role },
      {
        where: {
          userId,
          dashboardId,
        },
        transaction,
      },
    );

    this.logger.log(`Changed user role in dashboard`);
    return { message: 'Changed user role in dashboard' };
  }

  async checkOwnerPrivilege(
    userId: number,
    dashboardId: number,
  ): Promise<boolean> {
    const ownerExists = await this.userDashboardSharedRepository.findOne({
      where: { dashboardId, role: 'owner' },
    });

    CheckItemExistance(ownerExists, 'owner not found!');

    const userDashboardShared =
      await this.userDashboardSharedRepository.findOne({
        where: { userId, dashboardId },
      });

    CheckItemExistance(userDashboardShared, 'userDashboardShared not found!');

    if (userDashboardShared.role === 'user') {
      throw new HttpException(
        'This user does not have the privilege to perform this action!',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }

  async findOwner(dashboardId: number) {
    const ownerExists = await this.userDashboardSharedRepository.findOne({
      where: {
        dashboardId,
        role: 'owner',
      },
    });

    return ownerExists;
  }
}
