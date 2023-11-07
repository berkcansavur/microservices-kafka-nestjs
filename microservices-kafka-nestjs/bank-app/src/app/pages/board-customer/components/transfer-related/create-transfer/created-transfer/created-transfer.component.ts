import { Component, Input, OnInit } from "@angular/core";
import { TransferService } from "src/app/services/transfers.service";
import { ITransferItem } from "../../../../../../models/transfers.model";

@Component({
  selector: "[app-created-transfer]",
  templateUrl: "./created-transfer.component.html",
})
export class CreatedTransferComponent implements OnInit {
  @Input() returnedCreatedTransfer: ITransferItem | undefined;
  currencyType: string = "";
  fromAccount: string = "";
  toAccount: string = "";
  amount: number = 0;
  status: string | null = "";
  constructor(private readonly transferService: TransferService) {}
  ngOnInit(): void {
    this.setProps();
  }
  setProps() {
    if (this.returnedCreatedTransfer) {
      this.status = this.transferService.mapTransferStatus(
        this.returnedCreatedTransfer.status,
      );
      this.amount = this.returnedCreatedTransfer.amount;
      this.fromAccount = this.returnedCreatedTransfer.fromAccount;
      this.toAccount = this.returnedCreatedTransfer.toAccount;
      this.currencyType = this.returnedCreatedTransfer.currencyType;
    }
  }
  reloadPage(): void {
    window.location.reload();
  }
}
