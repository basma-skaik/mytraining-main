import { Module, forwardRef } from '@nestjs/common';
// import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationProvider } from './conversation.provider';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [forwardRef(() => MessageModule)],
  // controllers: [ConversationController],
  providers: [ConversationService, ...ConversationProvider],
  exports: [ConversationService]
})
export class ConversationModule {}
