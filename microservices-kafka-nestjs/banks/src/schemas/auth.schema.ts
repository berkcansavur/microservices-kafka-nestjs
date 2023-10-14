import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  versionKey: false,
})
export class CustomerAuth {
  @Prop({ type: Number, required: true })
  customerNumber: number;
  @Prop({ type: String, required: true })
  password: string;
}
export type CustomerAuthDocument = CustomerAuth & Document;
export const CustomerAuthSchema = SchemaFactory.createForClass(CustomerAuth);
