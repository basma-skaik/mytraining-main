import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationService } from '../conversation/conversation.service';
import { UserDashboardSharedService } from '../user.dashboard.shared/user.dashboard.shared.service';
import { REPOSITORIES } from 'src/common/constants';
import { Message } from './message.model';

@Injectable()
export class MessageService {
  constructor(
    @Inject(REPOSITORIES.MESSAGE_REPOSITORY)
    private messageRepository: typeof Message,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    private readonly userDashboardSharedService: UserDashboardSharedService,
  ) {}

  async createMessage(
    createMessageDto: CreateMessageDto,
    conversationId: number,
    senderId: number,
    transaction: any,
  ) {
    const newMessage = await this.messageRepository.create(
      {
        ...createMessageDto,
        conversationId: conversationId,
        senderId: senderId,
      },
      { transaction },
    );

    return newMessage;
  }

  async sendBroadcastMessageToAll(
    ownerId: number,
    dashboardId: number,
    createMessageDto: CreateMessageDto,
    transaction: any,
  ) {
    await this.userDashboardSharedService.checkOwnerPrivilege(ownerId, dashboardId);
  
    const sharedUsersIds =
      await this.userDashboardSharedService.getSharedUserIdsByDashboardId(
        dashboardId,
      );
  
    await Promise.all(
      sharedUsersIds.map(async (sharedUserId) => {
        const conversation =
          await this.conversationService.getOrCreateConversation(
            ownerId,
            sharedUserId,
            transaction,
          );
  
        await this.createMessage(
          createMessageDto,
          conversation.id,
          ownerId,
          transaction,
        );
  
        return 'message created';
      }),
    );
  
    return { message: 'Send broadcast message to all shared users successfully' };
  }
  
  async sendBroadcastMessageToSelected(
    ownerId: number,
    dashboardId: number,
    createMessageDto: CreateMessageDto,
    selectedUserIds: number[],
    transaction: any,
  ) {
    await this.userDashboardSharedService.checkOwnerPrivilege(ownerId, dashboardId);
  
    const sharedUsersIds =
      await this.userDashboardSharedService.getSharedUserIdsByDashboardId(
        dashboardId,
      );
  
    // Filter sharedUsersIds to include only the selectedUserIds
    const filteredUserIds = sharedUsersIds.filter((userId) =>
      selectedUserIds.includes(userId),
    );
  
    await Promise.all(
      filteredUserIds.map(async (sharedUserId) => {
        const conversation =
          await this.conversationService.getOrCreateConversation(
            ownerId,
            sharedUserId,
            transaction,
          );
  
        await this.createMessage(
          createMessageDto,
          conversation.id,
          ownerId,
          transaction,
        );
  
        return 'message created';
      }),
    );
  
    return { message: 'Send broadcast message to selected shared users successfully' };
  }
  

  async sendReply(
    ownerId: number,
    sharedUserId: number,
    createMessageDto: CreateMessageDto,
    transaction: any,
  ) {
    const conversation = await this.conversationService.getOrCreateConversation(
      ownerId,
      sharedUserId,
      transaction,
    );
    await this.createMessage(
      createMessageDto,
      conversation.id,
      sharedUserId,
      transaction,
    );
    return { message: 'Reply sent successfully' };
  }

  // async sendGroupMessageToConversation(
  //   senderId: number,
  //   conversationId: number,
  //   createMessageDto: CreateMessageDto,
  //   transaction: any,
  // ) {
  //   const participant = await this.conversationService.getParticipant(
  //     conversationId,
  //     senderId,
  //   );
  //   const message = await this.createMessage(
  //     createMessageDto,
  //     conversationId,
  //     participant.userId,
  //     transaction,
  //   );

  //   return message;
  // }


  async removeMessagesForConversation(
    conversationId: number,
    ownerId: number,
    transaction: any,
  ) {
    await this.messageRepository.update(
      {
        deletedAt: new Date(),
        deletedBy: ownerId,
      },
      {
        where: {
          conversationId,
        },
        transaction,
      },
    );
  }
}
