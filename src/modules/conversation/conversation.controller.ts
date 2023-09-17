// import {
//   Controller,
//   Post,
//   Body,
//   UseInterceptors,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { ConversationService } from './conversation.service';
// import { TransactionParam, User } from 'src/common/decorator';
// import { Roles } from 'src/common/decorator/roles.decorator';
// import { Role } from 'src/common/constants';
// import { CreateGroupConversationDto } from './dtos/create-group.conversation.dto';
// import { TransactionInterceptor } from 'src/common/interceptors';
// import { Transaction } from 'sequelize';

// @Controller('conversation')
// export class ConversationController {
//   constructor(private readonly conversationService: ConversationService) {}

//   @Roles(Role.Owner)
//   @Post('group')
//   @UseInterceptors(TransactionInterceptor)
//   async createGroupConversation(
//     @TransactionParam() transaction: Transaction,
//     @User() owner,
//     @Body() createGroupConversationDto: CreateGroupConversationDto,
//   ) {
//     const groupConversation =
//       await this.conversationService.createGroupConversation(
//         owner.id,
//         createGroupConversationDto.participants,
//         transaction,
//       );
//     return {
//       message: 'Group conversation created successfully',
//       conversation: groupConversation,
//     };
//   }

//   @Delete('group/conversation/:conversationId/user/:userId')
//   @UseInterceptors(TransactionInterceptor)
//   async removeUserGroup(
//     @Param('conversationId') conversationId: number,
//     @Param('userId') userId: number,
//     @User() owner,
//     @TransactionParam() transaction: Transaction,
//   ) {
//     return await this.conversationService.removeUserGroup(
//       conversationId,
//       userId,
//       owner.id,
//       transaction,
//     );
//   }
// }
