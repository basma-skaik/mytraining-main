import { REPOSITORIES } from 'src/common/constants';
import { Conversation } from './conversation.model';

export const ConversationProvider = [
  {
    provide: REPOSITORIES.CONVERSATION_REPOSITORY,
    useFactory: () => {
      return Conversation;
    },
  },
];