import { REPOSITORIES } from 'src/common/constants';
import { Users } from './user.model';

export const UserProvider = [
  {
    provide: REPOSITORIES.USER_REPOSITORY,
    useFactory: () => {
      return Users;
    },
  },
];