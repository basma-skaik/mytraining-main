import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';
import { Users } from '../users/user.model';
import { Dashboard } from '../dashboard/dashboard.model';

@Table({
  tableName: 'DashboardInvitations',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class DashboardInvitation extends Model<DashboardInvitation> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Users)
  @Column
  invitingUserId: number;

  @ForeignKey(() => Users)
  @Column
  invitedUserId: number;

  @ForeignKey(() => Dashboard)
  @Column
  dashboardId: number;

  @Column
  status: string; // You can define specific statuses like "pending," "accepted," "declined"

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
}
