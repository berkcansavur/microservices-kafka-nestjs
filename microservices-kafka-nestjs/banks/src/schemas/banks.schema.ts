import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as mSchema, Document } from "mongoose";
import { BANK_ACTIONS, CURRENCY_TYPES } from "../constants/banks.constants";

@Schema({
  _id: false,
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

export class ActionLog {
  @Prop({ type: String, enum: Object.values(BANK_ACTIONS) })
  action: string;

  @Prop({ type: String, required: false })
  message?: string;

  @Prop({ type: mSchema.Types.ObjectId, required: true })
  user?: string;

  @Prop({ type: Date, default: Date.now })
  occurredAt: Date;
}

const ActionLogSchema = SchemaFactory.createForClass(ActionLog);

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Bank {
  @Prop({ type: mSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: [mSchema.Types.ObjectId] })
  customers: Types.ObjectId[];

  @Prop({ type: String, required: true })
  bankName: string;

  @Prop({ type: mSchema.Types.ObjectId, ref: "BankDirector", required: true })
  bankManager: Types.ObjectId;

  @Prop({ type: [mSchema.Types.ObjectId], ref: "BankDepartmentDirector" })
  departmentDirectors: Types.ObjectId[];

  @Prop({ type: [mSchema.Types.ObjectId], ref: "BankCustomerRepresentative" })
  customerRepresentatives: Types.ObjectId[];

  @Prop({ type: BalanceSchema })
  balance: Balance[];

  @Prop({
    type: [{ type: ActionLogSchema, ref: "ActionLog" }],
    default: [{ action: BANK_ACTIONS.CREATED }],
  })
  actionLogs: ActionLog[];
}
export type BankDocument = Bank & Document;
export const BanksSchema = SchemaFactory.createForClass(Bank);
