import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { AccountService } from './accounts.service';

@Controller("/accounts")
export class AccountsController implements OnModuleInit {
  constructor(private readonly appService: AccountService) {}

}
