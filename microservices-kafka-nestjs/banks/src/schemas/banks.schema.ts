import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as mSchema, Document } from "mongoose";
import { User, UserSchema } from "./customers.schema";
import { CURRENCY_TYPES } from "../constants/banks.constants";

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Bank {
  @Prop({ type: mSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: [{ type: UserSchema }], ref: "Users" })
  users: User[];

  @Prop({ type: Number, enum: CURRENCY_TYPES })
  currencies: number;
}
export type BankDocument = Bank & Document;
export const BanksSchema = SchemaFactory.createForClass(Bank);
