import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CoinBaseAuthService } from './coinbase-auth.service';
import { COINBASE_API } from './config';

@Injectable()
export class CoinBaseService {
  constructor(
    private readonly httpService: HttpService,
    private readonly coinBaseAuthService: CoinBaseAuthService,
  ) {}

  async getPrimaryAccountTransactions(userId: string): Promise<any> {
    const primaryAccount = await this.getPrimaryAccount(userId);
    return this.getAccountTransactions(primaryAccount.id, userId);
  }

  private async getPrimaryAccount(userId: string): Promise<any> {
    try {
      const response$ = this.httpService.get(`${COINBASE_API}/accounts`, {
        headers: await this.getHeaders(userId),
      });
      const response = await lastValueFrom(response$);
      return response.data.data.find((account) => account.primary);
    } catch (error) {
      throw error.response.data;
    }
  }

  private async getAccountTransactions(accountId: string, userId: string) {
    try {
      const response$ = this.httpService.get(
        `${COINBASE_API}/accounts/${accountId}/transactions`,
        {
          headers: await this.getHeaders(userId),
        },
      );
      const response = await lastValueFrom(response$);
      return response.data.data.find((account) => account.primary);
    } catch (error) {
      throw error.response.data;
    }
  }

  private async getHeaders(userId: string) {
    return {
      Authorization: `Bearer ${await this.coinBaseAuthService.getAccessToken(
        userId,
      )}`,
    };
  }
}
