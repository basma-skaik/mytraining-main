import { REPOSITORIES } from 'src/common/constants';
import { Dashboard } from './dashboard.model';

export const DashboardProvider = [
  {
    provide: REPOSITORIES.DASHBOARD_REPOSITORY,
    useFactory: () => {
      return Dashboard;
    },
  },
];