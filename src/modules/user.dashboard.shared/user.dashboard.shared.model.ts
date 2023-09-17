import { Table, Column, Model, ForeignKey, DataType, AllowNull } from 'sequelize-typescript';
import { Users } from '../users/user.model';
import { Dashboard } from '../dashboard/dashboard.model';
import { Role } from 'src/common/constants';

@Table({
  tableName: 'UserDashboardShared',
  timestamps: true,
  underscored: true,
  paranoid: true,
})

export class UserDashboardShared extends Model<UserDashboardShared> {
  @ForeignKey(() => Users)
  @Column
  userId: number;

  @ForeignKey(() => Dashboard)
  @Column
  dashboardId: number;

  @AllowNull(false)
  @Column
  role: Role; 

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
