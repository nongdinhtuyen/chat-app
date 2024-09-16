import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema()
export class Permission {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @Prop()
  method: string;

  @Prop()
  path: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
