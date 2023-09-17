import { REPOSITORIES } from 'src/common/constants';
import { Reports } from './report.model';

export const ReportProvider = [
  {
    provide: REPOSITORIES.REPORT_REPOSITORY,
    useFactory: () => {
      return Reports;
    },
  },
];