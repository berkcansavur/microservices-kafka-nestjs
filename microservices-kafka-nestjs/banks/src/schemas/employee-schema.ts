import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as mSchema } from "mongoose";
import {
  BANK_ACTIONS,
  CURRENCY_TYPES,
  TRANSACTION_RESULTS,
  TRANSACTION_TYPES,
  TRANSFER_STATUSES,
} from "src/constants/banks.constants";
import { EMPLOYEE_ACTIONS } from "src/types/employee.types";
@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
export class PrivateTransfer {
  @Prop({ type: mSchema.Types.ObjectId })
  _id: string;

  @Prop({ type: String, enum: CURRENCY_TYPES, required: true })
  currencyType: string;

  @Prop({
    type: Number,
    enum: TRANSFER_STATUSES,
    default: TRANSFER_STATUSES.CREATED,
    required: true,
  })
  status: number;

  @Prop({ type: mSchema.Types.ObjectId, required: true })
  userId: string;

  @Prop({ type: mSchema.Types.ObjectId })
  fromAccount?: string;

  @Prop({ type: mSchema.Types.ObjectId, required: true })
  toAccount: string;

  @Prop({ type: Number, required: true })
  amount: number;
}
export const PrivateTransferSchema =
  SchemaFactory.createForClass(PrivateTransfer);
@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
export class Transaction {
  @Prop({ type: String, enum: Object.values(TRANSACTION_TYPES) })
  transactionType: string;

  @Prop({
    type: String,
    enum: Object.values(TRANSACTION_RESULTS),
    default: TRANSACTION_RESULTS.AWAITING_EVALUATION,
  })
  result: string;

  @Prop({ type: String })
  customer?: string;

  @Prop({ type: PrivateTransferSchema, ref: "PrivateTransfer" })
  transfer?: PrivateTransfer;

  @Prop({ type: Date, default: Date.now })
  occurredAt: Date;
}

const TransactionSchema = SchemaFactory.createForClass(Transaction);
@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
export class ActionLog {
  @Prop({ type: String, enum: Object.values(EMPLOYEE_ACTIONS) })
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

  @Prop({
    type: [{ type: TransactionSchema, ref: "Transaction" }],
    required: false,
  })
  transactions: Transaction[];
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

  @Prop({
    type: [{ type: TransactionSchema, ref: "Transaction" }],
    required: false,
  })
  transactions: Transaction[];
}
export type BankDepartmentDirectorDocument = BankDepartmentDirector & Document;
export const BankDepartmentDirectorSchema = SchemaFactory.createForClass(
  BankDepartmentDirector,
);
@Schema({
  timestamps: true,
  versionKey: false,
})
export class PrivateCustomer {
  @Prop({ type: mSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  customerName: string;

  @Prop({ type: String, required: true })
  customerSurname: string;

  @Prop({ type: Number, required: true })
  customerNumber: number;

  @Prop({ type: Number, required: true })
  customerAge: number;

  @Prop({ type: String, required: true })
  customerEmail: string;

  @Prop({ type: [{ type: mSchema.Types.ObjectId }], default: [] })
  accounts: mSchema.Types.ObjectId[];

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}
export type PrivateCustomerDocument = PrivateCustomer & Document;
export const PrivateCustomerSchema =
  SchemaFactory.createForClass(PrivateCustomer);
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

  @Prop({ type: PrivateCustomerSchema, ref: "PrivateCustomer" })
  customers: PrivateCustomer[];

  @Prop({
    type: [{ type: ActionLogSchema, ref: "ActionLog" }],
    default: [{ action: BANK_ACTIONS.CREATED }],
  })
  actionLogs: ActionLog[];

  @Prop({
    type: [{ type: TransactionSchema, ref: "Transaction" }],
    required: false,
  })
  transactions: Transaction[];
}
export type BankCustomerRepresentativeDocument = BankCustomerRepresentative &
  Document;
export const BankCustomerRepresentativeSchema = SchemaFactory.createForClass(
  BankCustomerRepresentative,
);
