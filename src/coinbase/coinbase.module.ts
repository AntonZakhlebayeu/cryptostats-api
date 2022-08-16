import { Module } from '@nestjs/common';
import { CoinBaseController } from './coinbase.controller';
import { CoinBaseAuthService } from './coinbase-auth.service';
import { HttpModule } from '@nestjs/axios';
import { AppModule } from 'src/app.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule, UserModule],
  controllers: [CoinBaseController],
  providers: [CoinBaseAuthService],
})
export class CoinBaseModule {}
