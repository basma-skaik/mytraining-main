import { REPOSITORIES } from 'src/common/constants';
import { DashboardInvitation } from './dashboard-invitation.model';

export const DashboardInvitationProvider = [
  {
    provide: REPOSITORIES.DASHBOARD_INVITATION_REPOSITORY,
    useFactory: () => {
      return DashboardInvitation;
    },
  },
];
