import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as mSchema } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class TransferReport {
  @Prop({ type: mSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: mSchema.Types.ObjectId, ref: 'Transfer', required: true })
  transfer: string;

  @Prop({})
  createdBy: string;

  @Prop({})
  cretedAt: Date;

  @Prop({})
  updatedAt: Date;
}
export type TransferReportDocument = TransferReport & Document;
export const TransferReportSchema =
  SchemaFactory.createForClass(TransferReport);
