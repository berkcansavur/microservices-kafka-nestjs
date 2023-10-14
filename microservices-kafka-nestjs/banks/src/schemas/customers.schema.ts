import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as mSchema } from "mongoose";
import { CUSTOMER_ACTIONS } from "../constants/banks.constants";

@Schema({
  _id: false,
  versionKey: false,
})
export class ActionLog {
  @Prop({ type: Number, enum: CUSTOMER_ACTIONS, required: true })
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
export class Customer {
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

  @Prop({ type: Number, required: true, length: 11 })
  customerSocialSecurityNumber: number;

  @Prop({ type: [{ type: mSchema.Types.ObjectId }], default: [] })
  accounts: mSchema.Types.ObjectId[];

  @Prop({ type: [{ type: ActionLogSchema, ref: "ActionLog" }], default: [] })
  customerActions: ActionLog[];

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  approvedAt: Date;
}
export type CustomerDocument = Customer & Document;
export const CustomerSchema = SchemaFactory.createForClass(Customer);
