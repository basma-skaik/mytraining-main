import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Users } from 'src/modules/users/user.model';
import { Conversation } from '../conversation/conversation.model';

@Table({
  tableName: 'Messages',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Message extends Model<Message> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id: number;

  @Column
  text: string;

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

  @ForeignKey(()=> Users)
  @Column(DataType.INTEGER)
  senderId: number;

  @BelongsTo(()=> Users, 'senderId')
  sender: Users;

  @ForeignKey(()=> Conversation)
  @Column(DataType.INTEGER)
  conversationId: number;

  @BelongsTo(()=> Conversation)
  conversation: Conversation
}
