import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as mSchema } from 'mongoose';
import { USER_ACTIONS } from '../constants/banks.constants';

@Schema({
  _id: false,
  versionKey: false,
})
export class ActionLog {
  @Prop({ type: Number, enum: USER_ACTIONS, required: true })
  action: number;

  @Prop({ type: String, required: false })
  message?: string;

  @Prop({ type: mSchema.Types.ObjectId, required: true })
  user: string;

  @Prop({ type: Date, default: Date.now })
  occurredAt: Date;
}

const ActionLogSchema = SchemaFactory.createForClass(ActionLog);

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ type: mSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  userName: string;

  @Prop({ type: Number, required: true })
  userAge: number;

  @Prop({ type: String, required: true })
  userEmail: string;

  @Prop({ type: Number, required: true })
  userSocialSecurityNumber: number;

  @Prop({ type: [{ type: mSchema.Types.ObjectId }], default: [] })
  accounts: mSchema.Types.ObjectId[];

  @Prop({ type: [{ type: ActionLogSchema, ref: 'ActionLog' }], default: [] })
  userActions: ActionLog[];
  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  approvedAt: Date;
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
