import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Conversation } from './conversation.model';
import { REPOSITORIES } from 'src/common/constants';
// import { GroupConversationParticipant } from './GroupConversationParticipant.model';
import { CheckItemExistance } from 'src/common/utils';
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

  // async createGroupConversation(
  //   ownerId: number,
  //   participants: number[],
  //   transaction: any,
  // ) {
  //   // Create the group conversation
  //   const groupConversation = await this.conversationRepository.create(
  //     {
  //       ownerId,
  //       sharedUserId: ownerId,
  //       isGroup: true,
  //     },
  //     { transaction },
  //   );

  //   // Prepare an array of participant objects
  //   const participantObjects = participants.map((participantId) => ({
  //     conversationId: groupConversation.id,
  //     userId: participantId,
  //   }));

  //   // Add participants to the conversation
  //   // TODO: bulkCreate
  //   await this.groupConversationParticipantRepository.bulkCreate(
  //     participantObjects,
  //     { transaction },
  //   );

  //   return groupConversation;
  // }

  // async getParticipant(conversationId: number, senderId: number) {
  //   const participant =
  //     await this.groupConversationParticipantRepository.findOne({
  //       where: {
  //         conversationId,
  //         userId: senderId,
  //       },
  //     });

  //   CheckItemExistance(
  //     participant,
  //     'Sender is not a participant in the group conversation!',
  //   );

  //   return participant;
  // }

  // async removeUserGroup(
  //   conversationId: number,
  //   userId: number,
  //   ownerId: number,
  //   transaction: any,
  // ) {
  //   const participant = await this.getParticipant(conversationId, userId);
  //   CheckItemExistance(participant, 'Participant not found in this group!');

  //   await this.groupConversationParticipantRepository.update(
  //     {
  //       deletedAt: new Date(),
  //       deletedBy: ownerId,
  //     },
  //     {
  //       where: {
  //         conversationId,
  //         userId,
  //       },
  //       transaction,
  //     },
  //   );

  //   const remainingParticipants =
  //     await this.groupConversationParticipantRepository.count({
  //       where: {
  //         conversationId,
  //       },
  //       transaction,
  //     });

  //   if (remainingParticipants === 0) {
  //     const conversation = await this.conversationRepository.findByPk(
  //       conversationId,
  //     );

  //     if (conversation) {
  //       await Promise.all([
  //         conversation.update(
  //           {
  //             deletedAt: new Date(),
  //             deletedBy: ownerId,
  //           },
  //           { transaction },
  //         ),
  //         this.messageService.removeMessagesForConversation(
  //           conversationId,
  //           ownerId,
  //           transaction,
  //         ),
  //       ]);
  //     }
  //   }
  //   return {
  //     message: `User removed from group conversation successfully by ${ownerId}`,
  //   };
  // }
}
