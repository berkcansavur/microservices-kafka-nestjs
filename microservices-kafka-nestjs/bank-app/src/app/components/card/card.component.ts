import { Component, Input, OnInit } from "@angular/core";
import { IAccountItem } from "src/app/models/accounts.model";
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
  }
  setAccountCustomProps() {
    const { accountItem } = this;
    const status: number | undefined = accountItem?.status;
    this.accountStatus = this.accountService.mapAccountStatus(status);
  }
}
