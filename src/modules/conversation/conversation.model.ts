import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Users } from 'src/modules/users/user.model';
import { Message } from '../message/message.model';

@Table({
  tableName: 'Conversations',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Conversation extends Model<Conversation> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id: number;

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

  //
  @ForeignKey(() => Users)
  @Column(DataType.INTEGER)
  ownerId: number;

  @BelongsTo(() => Users, 'ownerId')
  owner: Users;

  @ForeignKey(() => Users)
  @Column(DataType.INTEGER)
  sharedUserId: number;

  @BelongsTo(() => Users, 'sharedUserId')
  sharedUser: Users;

  @HasMany(() => Message)
  message: Message[];

}
