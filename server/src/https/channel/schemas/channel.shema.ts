import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Chat } from 'src/https/chat/schemas/chat.schema';
import { User } from 'src/https/users/schemas/user.schema';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  admins: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  members: User[];

  @Prop()
  isGroup: boolean;

  @Prop()
  nameChannel: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
