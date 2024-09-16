import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomersDocument = HydratedDocument<Customers>;

@Schema()
export class Customers {
  @Prop()
  name: string;

  @Prop()
  age: 36;

  @Prop()
  address: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  profession: string;
}

export const CustomersSchema = SchemaFactory.createForClass(Customers);
CustomersSchema.index({ name: 1, age: 1 });
// CustomersSchema.index({ age: 1 });
