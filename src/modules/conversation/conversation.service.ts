import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Conversation } from './conversation.model';
import { REPOSITORIES } from 'src/common/constants';
import { MessageService } from '../message/message.service';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(REPOSITORIES.CONVERSATION_REPOSITORY)
    private conversationRepository: typeof Conversation,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
  ) {}

  async getOrCreateConversation(
    ownerId: number,
    sharedUserId: number,
    transaction: any,
  ) {
    const existingConversation = await this.conversationRepository.findOne({
      where: {
        ownerId,
        sharedUserId,
      },
      transaction,
    });

    if (existingConversation) {
      return existingConversation;
    }

    const newConversation = await this.conversationRepository.create(
      {
        ownerId,
        sharedUserId: sharedUserId,
      },
      { transaction },
    );
    return newConversation;
  }

  async removeSharedUserConversations(
    ownerId: number,
    userId: number,
    transaction: any,
  ) {
    const conversations = await this.conversationRepository.findAll({
      where: {
        sharedUserId: userId,
        ownerId: ownerId,
      },
      transaction,
    });

    await Promise.all(
      conversations.map(async (conversation) => {
        await this.messageService.removeMessagesForConversation(
          conversation.id,
          ownerId,
          transaction,
        );

        await conversation.update(
          {
            deletedAt: new Date(),
            deletedBy: ownerId,
          },
          { transaction },
        );
      }),
    );

    return { message: 'SharedUser Conversations removed successfully' };
  }

}
