import { Module } from '@nestjs/common';
import { UserDashboardProvider } from './user.dashboard.shared.provider';
import { UserDashboardSharedService } from './user.dashboard.shared.service';
import { userDashboardSharedController } from './user.dashboard.shared.controller';
import { ConversationModule } from '../conversation/conversation.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConversationModule, DashboardModule, UsersModule],
  controllers: [userDashboardSharedController],
  providers: [ UserDashboardSharedService,...UserDashboardProvider],
  exports: [UserDashboardSharedService]
})
export class UserDashboardSharedModule {}
