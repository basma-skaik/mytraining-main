import { REPOSITORIES } from 'src/common/constants';
import { Conversation } from './conversation.model';
// import { GroupConversationParticipant } from './GroupConversationParticipant.model';

export const ConversationProvider = [
  {
    provide: REPOSITORIES.CONVERSATION_REPOSITORY,
    useFactory: () => {
      return Conversation;
    },
  },
  // {
  //   provide: REPOSITORIES.GROUP_CONVERSATION_PARTICIPANT_REPOSITORY,
  //   useFactory: () => {
  //     return GroupConversationParticipant;
  //   },
  // },
];