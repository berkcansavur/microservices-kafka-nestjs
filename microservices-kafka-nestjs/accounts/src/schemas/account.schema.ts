import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as mSchema } from "mongoose";
import {
  ACCOUNT_ACTIONS,
  ACCOUNT_STATUS,
  CURRENCY_TYPES,
} from "src/constants/account.constants";

export class ActionLog {
  @Prop({ type: Number, enum: ACCOUNT_ACTIONS, required: true })
  action: number;

  @Prop({ type: String, required: false })
  message?: string;

  @Prop({ type: mSchema.Types.ObjectId, required: true })
  user?: string;

  @Prop({ type: Date, default: Date.now })
  occurredAt: Date;
}

const ActionLogSchema = SchemaFactory.createForClass(ActionLog);
@Schema({
  versionKey: false,
  timestamps: false,
})
export class Balance {
  @Prop({ type: String, enum: CURRENCY_TYPES, required: true })
  currencyType: string;

  @Prop({ type: Number, required: false })
  amount?: number;
}

const BalanceSchema = SchemaFactory.createForClass(Balance);

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

  @Prop({ type: Number, required: false })
  interest: number;

  @Prop({ type: [{ type: BalanceSchema, ref: "Balance" }], required: false })
  balance: Balance[];

  @Prop({
    type: Number,
    enum: ACCOUNT_STATUS,
    default: ACCOUNT_STATUS.CREATED,
    required: true,
  })
  status: number;

  @Prop({
    type: [{ type: ActionLogSchema, ref: "ActionLog" }],
    default: ACCOUNT_ACTIONS.CREATED,
  })
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
