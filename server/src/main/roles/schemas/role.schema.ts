import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Permission } from 'src/main/permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
  @Prop()
  name: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
