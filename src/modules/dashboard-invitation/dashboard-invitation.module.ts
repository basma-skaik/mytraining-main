import { Module } from '@nestjs/common';
import { DashboardInvitationProvider } from './dashboard-invitation.provider';
import { DashboardInvitationService } from './dashboard-invitation.service';
import { UserDashboardSharedModule } from '../user.dashboard.shared/user.dashboard.shared.module';
import { DashboardInvitationController } from './dashboard-invitation.controller';

@Module({
  imports: [UserDashboardSharedModule],
  controllers: [DashboardInvitationController],
  providers: [DashboardInvitationService, ...DashboardInvitationProvider],
  exports: [DashboardInvitationService],
})
export class DashboardInvitationModule {}
