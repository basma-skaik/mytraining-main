import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { DATABASE_CONFIG, PROVIDERS } from 'src/common/constants';
import { Users } from '../users/user.model';
import { Reports } from '../reports/report.model';
import { Dashboard } from '../dashboard/dashboard.model';
import { Conversation } from '../conversation/conversation.model';
import { Message } from '../message/message.model';
import { UserDashboardShared } from '../user.dashboard.shared/user.dashboard.shared.model';
// import { GroupConversationParticipant } from '../conversation/GroupConversationParticipant.model';
import { TransactionInterceptorProvider } from 'src/common/interceptors/transaction.interceptor';
import { DashboardInvitation } from '../dashboard-invitation/dashboard-invitation.model';

// Create a factory function to provide Sequelize instance
export const sequelizeFactory = {
  provide: Sequelize,
  useFactory: (configService: ConfigService) => {
    return new Sequelize({
      ...configService.get(DATABASE_CONFIG),
      logging: false,
    });
  },
  inject: [ConfigService],
};

export const databaseProvider = [
  sequelizeFactory, // Provide Sequelize instance using the factory function
  {
    provide: PROVIDERS.DATABASE_PROVIDER,
    useFactory: (sequelize: Sequelize) => {
      sequelize.addModels([
        Users,
        Reports,
        Dashboard,
        UserDashboardShared,
        Conversation,
        Message,
        // GroupConversationParticipant,
        DashboardInvitation
      ]);
      return sequelize;
    },
    inject: [Sequelize],
  },
  TransactionInterceptorProvider, // Add the TransactionInterceptorProvider to the providers
];
