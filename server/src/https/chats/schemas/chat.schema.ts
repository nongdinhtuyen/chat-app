import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RolesEnum } from 'src/https/roles/roles.enum';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ unique: true })
  idUser: string;

  @Prop()
  date: string;

  @Prop()
  username: string;

  @Prop()
  text: string;

  @Prop()
  password: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
