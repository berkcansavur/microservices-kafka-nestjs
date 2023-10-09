import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as mSchema } from "mongoose";
import {
  ACCOUNT_ACTIONS,
  ACCOUNT_STATUS,
} from "src/constants/account.constants";
export class ActionLog {
  @Prop({ type: Number, enum: ACCOUNT_ACTIONS, required: true })
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
export class Account {
  @Prop({ type: mSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: mSchema.Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  accountNumber: number;

  @Prop({
    type: Number,
    enum: ACCOUNT_STATUS,
    default: ACCOUNT_STATUS.CREATED,
    required: true,
  })
  status: number;

  @Prop({ type: [{ type: ActionLogSchema, ref: "ActionLog" }], default: [] })
  actionLogs: ActionLog[];

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  approvedAt: Date;
}

export type AccountDocument = Account & Document;
export const AccountSchema = SchemaFactory.createForClass(Account);
