import { Schema as mSchema, Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CURRENCY_TYPES,
  TRANSFER_ACTIONS,
  TRANSFER_STATUSES,
} from '../constants/transfer.constants';

@Schema({
  _id: false,
  versionKey: false,
})
export class ActionLog {
  @Prop({ type: Number, enum: TRANSFER_ACTIONS, required: true })
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
export class Transfer {
  @Prop({ type: mSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

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
  userId: Types.ObjectId;

  @Prop({ type: mSchema.Types.ObjectId, required: true })
  fromAccount: string;

  @Prop({ type: mSchema.Types.ObjectId, required: true })
  toAccount: string;

  @Prop({ type: mSchema.Types.ObjectId, ref: 'TransferReport' })
  transferReport: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: [{ type: ActionLogSchema, ref: 'ActionLog' }], default: [] })
  actionLogs: ActionLog[];

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  approvedAt: Date;
}

export type TransferDocument = Transfer & Document;
export const TransferSchema = SchemaFactory.createForClass(Transfer);
