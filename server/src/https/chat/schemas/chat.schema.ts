import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RolesEnum } from 'src/https/roles/roles.enum';
import { User } from 'src/https/users/schemas/user.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  userName: string;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  chatId: mongoose.Schema.Types.ObjectId;

  @Prop()
  text: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
