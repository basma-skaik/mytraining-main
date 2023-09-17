import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageProvider } from './message.provider';
import { UserDashboardSharedModule } from '../user.dashboard.shared/user.dashboard.shared.module';

@Module({
  imports: [forwardRef(() => ConversationModule), UserDashboardSharedModule],
  controllers: [MessageController],
  providers: [MessageService, ...MessageProvider],
  exports: [MessageService]
})
export class MessageModule {}
