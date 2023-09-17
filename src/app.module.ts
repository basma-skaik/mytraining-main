import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import config from 'config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/db/database.module';
import { UsersModule } from './modules/users/users.module';
import { ReportsModule } from './modules/reports/reports.module';
import { CustomLogger } from './common/loggers/winston.logger';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MessageModule } from './modules/message/message.module';
import { UserDashboardSharedModule } from './modules/user.dashboard.shared/user.dashboard.shared.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { DashboardInvitationModule } from './modules/dashboard-invitation/dashboard-invitation.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    ReportsModule,
    AuthModule,
    DashboardModule,
    MessageModule,
    ConversationModule,
    UserDashboardSharedModule,
    DashboardInvitationModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
],
  controllers: [ AuthController],
  providers: [ AuthService, CustomLogger],
})
export class AppModule {}
