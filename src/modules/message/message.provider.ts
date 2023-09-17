import { REPOSITORIES } from 'src/common/constants';
import { Message } from './message.model';

export const MessageProvider = [
  {
    provide: REPOSITORIES.MESSAGE_REPOSITORY,
    useFactory: () => {
      return Message;
    },
  },
];