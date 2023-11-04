import { Component, Input, OnInit } from "@angular/core";
import { IAccountItem, IBalanceItem } from "src/app/models/accounts.model";
import { ITransferItem } from "src/app/models/transfers.model";
import { AccountService } from "src/app/services/accounts.service";
import { TransferService } from "src/app/services/transfers.service";

@Component({
  selector: "[app-card]",
  templateUrl: "./card.component.html",
})
export class CardComponent implements OnInit {
  @Input() transferItem: ITransferItem | undefined;
  @Input() accountItem: IAccountItem | undefined;

  accountStatus: string | null = "";
  transferStatus: string | null = "";
  accountsBalances: IBalanceItem[] = [];
  accountsBalanceCurrencyType: string | null = "";
  accountsBalanceAmount: number | null = 0;
  constructor(
    private readonly accountService: AccountService,
    private readonly transferService: TransferService,
  ) {}

  ngOnInit(): void {
    this.setAccountCustomProps();
    this.setTransferCustomProps();
  }
  setTransferCustomProps() {
    const { transferItem } = this;
    const status: number | undefined = transferItem?.status;
    this.transferStatus = this.transferService.mapTransferStatus(status);
    this.setAccountsBalance();
  }
  setAccountCustomProps() {
    const { accountItem } = this;
    const status: number | undefined = accountItem?.status;
    this.accountStatus = this.accountService.mapAccountStatus(status);
  }
  setAccountsBalance() {
    const { accountItem } = this;
    if (accountItem?.balance) {
      this.accountsBalances = accountItem.balance.map((balance) => {
        this.accountsBalanceAmount = balance.amount;
        this.accountsBalanceCurrencyType = balance.currencyType;
        console.log(JSON.stringify(this.accountsBalances));
        return balance;
      });
    }
  }
}
