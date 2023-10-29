import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as mSchema } from "mongoose";
import {
  BANK_ACTIONS,
  EVENT_RESULTS,
  TRANSACTION_TYPES,
} from "src/constants/banks.constants";
import { Customer, CustomerSchema } from "./customers.schema";
@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
export class ActionLog {
  @Prop({ type: String, enum: Object.values(BANK_ACTIONS) })
  action: string;

  @Prop({ type: String, required: false })
  message?: string;

  @Prop({ type: mSchema.Types.ObjectId })
  user?: string;

  @Prop({ type: Date, default: Date.now })
  occurredAt: Date;
}

const ActionLogSchema = SchemaFactory.createForClass(ActionLog);
@Schema({
  timestamps: true,
  versionKey: false,
})
export class BankDirector {
  @Prop({ type: mSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  directorName: string;

  @Prop({ type: String, required: true })
  directorSurname: string;

  @Prop({ type: Number, required: true })
  directorAge: number;

  @Prop({ type: mSchema.Types.ObjectId, ref: "Bank" })
  bank: Types.ObjectId;

  @Prop({
    type: [{ type: ActionLogSchema, ref: "ActionLog" }],
    default: [{ action: BANK_ACTIONS.CREATED }],
  })
  actionLogs: ActionLog[];
}
export type BankDirectorDocument = BankDirector & Document;
export const BankDirectorSchema = SchemaFactory.createForClass(BankDirector);

@Schema({
  timestamps: true,
  versionKey: false,
})
export class BankDepartmentDirector {
  @Prop({ type: mSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  departmentDirectorName: string;

  @Prop({ type: String, required: true })
  departmentDirectorSurname: string;

  @Prop({ type: Number, required: true })
  departmentDirectorAge: number;

  @Prop({ type: String, required: true })
  department: string;

  @Prop({ type: mSchema.Types.ObjectId, ref: "Bank" })
  bank: Types.ObjectId;

  @Prop({
    type: [{ type: ActionLogSchema, ref: "ActionLog" }],
    default: [{ action: BANK_ACTIONS.CREATED }],
  })
  actionLogs: ActionLog[];
}
export type BankDepartmentDirectorDocument = BankDepartmentDirector & Document;
export const BankDepartmentDirectorSchema = SchemaFactory.createForClass(
  BankDepartmentDirector,
);
@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
export class Transaction {
  @Prop({ type: String, enum: Object.values(TRANSACTION_TYPES) })
  transactionType: string;

  @Prop({ type: String, enum: Object.values(EVENT_RESULTS) })
  result: string;

  @Prop({ type: mSchema.Types.ObjectId })
  customer?: string;

  @Prop({ type: mSchema.Types.ObjectId })
  transfer?: string;

  @Prop({ type: Date, default: Date.now })
  occurredAt: Date;
}

const TransactionSchema = SchemaFactory.createForClass(Transaction);
@Schema({
  timestamps: true,
  versionKey: false,
})
export class BankCustomerRepresentative {
  @Prop({ type: mSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  customerRepresentativeName: string;

  @Prop({ type: String, required: true })
  customerRepresentativeSurname: string;

  @Prop({ type: Number, required: true })
  customerRepresentativeAge: number;

  @Prop({ type: mSchema.Types.ObjectId, ref: "Bank" })
  bank: Types.ObjectId;

  @Prop({ type: CustomerSchema, ref: "Customer" })
  customers: Customer[];

  @Prop({
    type: [{ type: ActionLogSchema, ref: "ActionLog" }],
    default: [{ action: BANK_ACTIONS.CREATED }],
  })
  actionLogs: ActionLog[];

  @Prop({
    type: [{ TransactionSchema, ref: "Transaction" }],
    required: false,
  })
  transactions: Transaction[];
}
export type BankCustomerRepresentativeDocument = BankCustomerRepresentative &
  Document;
export const BankCustomerRepresentativeSchema = SchemaFactory.createForClass(
  BankCustomerRepresentative,
);
