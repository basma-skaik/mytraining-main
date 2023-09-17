import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Reports } from '../reports/report.model';
import { Users } from '../users/user.model';
import { UserDashboardShared } from '../user.dashboard.shared/user.dashboard.shared.model';
import { DashboardInvitation } from '../dashboard-invitation/dashboard-invitation.model';

@Table({
  tableName: 'Dashboard',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Dashboard extends Model<Dashboard> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  title: string;

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

  // Add the userId column as a foreign key
  @ForeignKey(() => Users)
  @Column
  userId: number;

  // Define the one-to-one relationship to Users
  @BelongsTo(() => Users)
  user: Users;

  @HasMany(() => Reports)
  reports: Reports[];

  @BelongsToMany(
    () => Users,
    () => UserDashboardShared,
    'dashboardId',
    'userId',
  )
  sharedWithUsers: Users[];

  @HasMany(() => DashboardInvitation, 'dashboardId')
  invitations: DashboardInvitation[];
}
