import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Users } from '../users/user.model';
import { Dashboard } from '../dashboard/dashboard.model';

@Table({
  tableName: 'Reports',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Reports extends Model<Reports> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id: number;

  @Column
  description: string;

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

  @BelongsTo(() => Users)
  users: Users;

  // Add the dashboardId column as a foreign key
  @ForeignKey(() => Dashboard)
  @Column
  dashboardId: number;

  @BelongsTo(() => Dashboard)
  dashboard: Dashboard;
}
