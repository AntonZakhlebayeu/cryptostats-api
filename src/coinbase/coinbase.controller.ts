import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CurrentUser } from 'src/user/current-user.decorator';
import { UserResponse } from 'src/user/dto/response/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CoinBaseAuthService } from './coinbase-auth.service';
import { CoinBaseService } from './coinbase.service';

@Controller('api/coinbase')
export class CoinBaseController {
  constructor(
    private readonly coinbaseAuthService: CoinBaseAuthService,
    private readonly coinbaseService: CoinBaseService,
  ) {}

  @Get('auth')
  @UseGuards(JwtAuthGuard)
  authorize(@Res() response: Response): void {
    this.coinbaseAuthService.authorize(response);
  }

  @Get('auth/callback')
  @UseGuards(JwtAuthGuard)
  handleCallback(@Req() request: Request, @Res() response: Response): void {
    this.coinbaseAuthService.handleCallback(request, response);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCoinbaseData(@CurrentUser() user: UserResponse): Promise<any> {
    return this.coinbaseService.getPrimaryAccountTransactions(user._id);
  }
}
