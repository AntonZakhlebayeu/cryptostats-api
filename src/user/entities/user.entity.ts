import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CoinBaseAuth } from './coinbase-auth.entity';

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  coinbase_auth?: CoinBaseAuth;
}

export const UserSchema = SchemaFactory.createForClass(User);
