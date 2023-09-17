import { Controller, Post, Body, Param, UseInterceptors } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { TransactionParam, User } from 'src/common/decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/constants';
import { TransactionInterceptor } from 'src/common/interceptors';
import { Transaction } from 'sequelize';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('broadcast/:dashboardId/send-broadcast-message-to-all')
  @UseInterceptors(TransactionInterceptor)
  async sendBroadcastMessageToAll(
    @Param('dashboardId') dashboardId: number,
    @Body() createMessageDto: CreateMessageDto,
    @User() sender: any,
    @TransactionParam() transaction: Transaction,
  ) {
    await this.messageService.sendBroadcastMessageToAll(
      sender.id,
      dashboardId,
      createMessageDto,
      transaction,
    );
    return { message: 'Broadcast messages sent successfully to all users' };
  }

  @Post('broadcast/:dashboardId/send-broadcast-message-to-selected')
  @UseInterceptors(TransactionInterceptor)
  async sendBroadcastMessageToSelected(
    @Param('dashboardId') dashboardId: number,
    @Body() createMessageDto: CreateMessageDto,
    @Body('selectedUserIds') selectedUserIds: number[],
    @User() sender: any,
    @TransactionParam() transaction: Transaction,
  ) {
    await this.messageService.sendBroadcastMessageToSelected(
      sender.id,
      dashboardId,
      createMessageDto,
      selectedUserIds,
      transaction,
    );
    return {
      message: 'Broadcast messages sent successfully to selected users',
    };
  }

  @Roles(Role.User)
  @Post('reply/:ownerId')
  @UseInterceptors(TransactionInterceptor)
  async sendReply(
    @Param('ownerId') ownerId: number,
    @User() sharedUser,
    @Body() createMessageDto: CreateMessageDto,
    @TransactionParam() transaction: Transaction,
  ) {
    await this.messageService.sendReply(
      ownerId,
      sharedUser.id,
      createMessageDto,
      transaction,
    );
    return { message: 'Reply sent successfully' };
  }

  // @UseInterceptors(TransactionInterceptor)
  // @Post(':conversationId')
  // async sendGroupMessageToConversation(
  //   // Make an interface => IUserIdentity
  //   @User() sender,
  //   @Param('conversationId') conversationId: number,
  //   @Body() createMessageDto: CreateMessageDto,
  //   @TransactionParam() transaction: Transaction,
  // ) {
  //   const groupMessage =
  //     await this.messageService.sendGroupMessageToConversation(
  //       sender.id,
  //       conversationId,
  //       createMessageDto,
  //       transaction,
  //     );

  //   return {
  //     message: 'Group message sent successfully',
  //     groupMessage,
  //   };
  // }
}
