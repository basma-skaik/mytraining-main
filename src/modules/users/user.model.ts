import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  HasMany,
  DataType,
  HasOne,
  BelongsToMany,
} from 'sequelize-typescript';
import { Reports } from '../reports/report.model';
import { Dashboard } from '../dashboard/dashboard.model';
import { UserDashboardShared } from '../user.dashboard.shared/user.dashboard.shared.model';
import { Role } from 'src/common/constants';
import { Conversation } from '../conversation/conversation.model';
import { DashboardInvitation } from '../dashboard-invitation/dashboard-invitation.model';

@Table({
  tableName: 'Users',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Users extends Model<Users> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  username: string;

  @AllowNull(false)
  @Column
  password: string;

  @Column
  name: string;

  @Column
  email: string;

  @AllowNull(false)
  @Column
  role: Role;

  // Soft delete properties
  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  @Column(DataType.DATE)
  deletedAt: Date | null;

  @Column(DataType.INTEGER)
  createdBy: number | null;

  @Column(DataType.INTEGER)
  updatedBy: number | null;

  @Column(DataType.INTEGER)
  deletedBy: number | null;

  @HasMany(() => Reports)
  reports: Reports[];

  @HasOne(() => Dashboard)
  dashboard: Dashboard;

  // Define the many-to-many relationship to Dashboard for sharing dashboards
  @BelongsToMany(
    () => Dashboard,
    () => UserDashboardShared,
    'userId',
    'dashboardId',
  )
  sharedDashboards: Dashboard[];

  @HasMany(() => Conversation)
  conversation: Conversation[];

  @HasMany(() => DashboardInvitation, 'invitingUserId')
  sentInvitations: DashboardInvitation[];

  @HasMany(() => DashboardInvitation, 'invitedUserId')
  receivedInvitations: DashboardInvitation[];
}
