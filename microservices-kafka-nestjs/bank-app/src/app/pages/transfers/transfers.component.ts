import { Component } from "@angular/core";
import { ITransferItem } from "src/app/models/transfers.model";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { TransferService } from "src/app/services/transfers.service";

@Component({
  selector: "app-transfers",
  templateUrl: "./transfer.component.html",
})
export class TransfersComponent {
  constructor(
    private readonly transferService: TransferService,
    private readonly tokenStorage: TokenStorageService,
  ) {}
  isChecked: boolean = false;
  transfers: ITransferItem[] = [];
  transferIds: string[] = [];
  customerId: string = "";
  errorMessage: string = "";
  isTransferPanelOpened: boolean = false;
  isDropdownMenuOpened: boolean = false;
  ngOnInit(): void {
    this.customerId = this.tokenStorage.getUser()._id.toString();
    this.setCustomersTransfers();
  }
  setCustomersTransfers() {
    this.transferService
      .sendGetCustomersTransfersRequest({ customerId: this.customerId })
      .subscribe({
        next: (data: any) => {
          this.transfers = data;
          console.log("Transfers: ", this.transfers);
        },
        error: (err: any) => {
          this.errorMessage = err.error.message;
        },
      });
  }
  setTransferStatus(transfer: ITransferItem) {
    const status: number | undefined = transfer.status;
    const mappedStatus = this.transferService.mapTransferStatus(status);
    return mappedStatus;
  }
  handleClickTransferPanel() {
    this.isTransferPanelOpened = !this.isTransferPanelOpened;
  }
  handleClickDropdownMenu() {
    this.isDropdownMenuOpened = !this.isDropdownMenuOpened;
  }
  handleClickCheckbox(transferId: string) {
    const checkbox = document.getElementById(
      `checkbox-table-search-${transferId}`,
    ) as HTMLInputElement;
    console.log(transferId);
    if (checkbox.checked === true && !this.transferIds.includes(transferId)) {
      this.transferIds.push(transferId);
      console.log("Transfer Ids: ", this.transferIds);
    }
    if (checkbox.checked === false && this.transferIds.includes(transferId)) {
      const ids = this.transferIds.filter((id) => {
        return id !== transferId;
      });
      this.transferIds = ids;
      console.log("Transfer Ids: ", this.transferIds);
    }
  }
  handleClickMasterCheckbox() {
    const checkbox = document.getElementById(
      "checkbox-all-search",
    ) as HTMLInputElement;
    if (checkbox.checked == true) {
      this.transfers.map((transfer) => {
        const singleCheckbox = document.getElementById(
          `checkbox-table-search-${transfer._id}`,
        ) as HTMLInputElement;
        if (singleCheckbox.checked !== true) {
          singleCheckbox.click();
        }
      });
    }
    if (checkbox.checked == false) {
      this.transfers.map((transfer) => {
        const singleCheckbox = document.getElementById(
          `checkbox-table-search-${transfer._id}`,
        ) as HTMLInputElement;
        if (singleCheckbox.checked === true) {
          singleCheckbox.click();
        }
      });
    }
    console.log("Transfer Ids: ", this.transferIds);
  }
}
