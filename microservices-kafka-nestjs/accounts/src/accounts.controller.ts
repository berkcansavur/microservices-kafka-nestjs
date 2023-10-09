import { Controller, Get } from '@nestjs/common';
import { AccountService } from './accounts.service';

@Controller()
export class AccountsController {
  constructor(private readonly appService: AccountService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
