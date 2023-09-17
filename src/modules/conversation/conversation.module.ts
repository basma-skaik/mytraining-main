import { Module, forwardRef } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationProvider } from './conversation.provider';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [forwardRef(() => MessageModule)],
  providers: [ConversationService, ...ConversationProvider],
  exports: [ConversationService]
})
export class ConversationModule {}
