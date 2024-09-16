import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Chat } from 'src/main/chats/schemas/chat.schema';
import { User } from 'src/main/users/schemas/user.schema';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  admin: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  members: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Chat.name })
  messages: Chat[];

  @Prop()
  image: string;

  @Prop()
  name: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
