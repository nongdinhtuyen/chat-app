import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Channel } from 'src/https/channel/schemas/channel.shema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  userName: string;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Channel.name })
  channelId: Channel[];

  @Prop()
  text: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
