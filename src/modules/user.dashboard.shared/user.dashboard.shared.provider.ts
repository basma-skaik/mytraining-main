import { REPOSITORIES } from 'src/common/constants';
import { UserDashboardShared } from './user.dashboard.shared.model';

export const UserDashboardProvider = [
  {
    provide: REPOSITORIES.USER_DASHBOARD_REPOSITORY,
    useFactory: () => {
      return UserDashboardShared;
    },
  },
];