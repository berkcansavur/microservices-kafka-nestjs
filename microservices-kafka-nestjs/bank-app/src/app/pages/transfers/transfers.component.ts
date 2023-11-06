import { Component } from "@angular/core";
import { CURRENCY_TYPES } from "src/app/constants/transfer-constants";

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
  createTransferForm: any = {
    fromAccount: null,
    toAccount: null,
    amount: null,
  };
  process: string = "";
  loading: boolean = false;
  failed: boolean = false;
  returnedCreatedTransfer: any = null;
  isChecked: boolean = false;
  transfers: ITransferItem[] = [];
  transferToRepeat: ITransferItem = Object();
  transferIds: string[] = [];
  customerId: string = "";
  selectedCurrencyType: string = "";
  errorMessage: string = "";
  isTransferPanelOpened: boolean = false;
  isDropdownMenuOpened: boolean = false;
  isTransferCurrencyOpen: boolean = false;
  currencyTypes = Object.values(CURRENCY_TYPES);
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
  handleClickCheckbox(transfer: ITransferItem) {
    const checkbox = document.getElementById(
      `checkbox-table-search-${transfer._id}`,
    ) as HTMLInputElement;
    console.log(transfer._id);
    if (checkbox.checked === true && !this.transferIds.includes(transfer._id)) {
      this.transferIds.push(transfer._id);
      this.transferToRepeat = transfer;
    }
    if (checkbox.checked === false && this.transferIds.includes(transfer._id)) {
      const ids = this.transferIds.filter((id) => {
        return id !== transfer._id;
      });
      this.transferIds = ids;
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
  }
  toggleTransferTypesMenu() {
    this.isTransferCurrencyOpen = !this.isTransferCurrencyOpen;
  }
  onSelectedCurrencyType(currencyType: string) {
    this.selectedCurrencyType = currencyType;
    this.isTransferCurrencyOpen = !this.isTransferCurrencyOpen;
  }
  setLoading(state: boolean) {
    this.loading = state;
  }
  setProcess(process: string) {
    this.process = process;
  }
  onCreateTransferSubmit(): void {
    const { selectedCurrencyType, tokenStorage, transferService } = this;
    const { fromAccount, toAccount, amount } = this.createTransferForm;
    const userId = tokenStorage.getUser()._id;
    this.setLoading(true);
    this.setProcess("Create transfer");
    transferService
      .sendCreateMoneyTransferRequest({
        currencyType: selectedCurrencyType,
        userId,
        fromAccount,
        toAccount,
        amount,
      })
      .subscribe({
        next: (data: any) => {
          this.returnedCreatedTransfer = data;
          this.setLoading(false);
          this.reloadPage();
        },
        error: (err: any) => {
          this.errorMessage = err.error.message;
          this.setLoading(false);
        },
      });
  }
  handleRepeatTransfer() {
    const { transferService } = this;
    this.setLoading(true);
    this.setProcess("Repeat transfer");
    if ((this.transferIds.length = 1) && this.transferToRepeat) {
      console.log("Transfer: ", JSON.stringify(this.transferToRepeat));
      const { userId, currencyType, fromAccount, toAccount, amount } =
        this.transferToRepeat;
      transferService
        .sendCreateMoneyTransferRequest({
          currencyType,
          userId,
          fromAccount,
          toAccount,
          amount,
        })
        .subscribe({
          next: (data: any) => {
            this.returnedCreatedTransfer = data;
            this.setLoading(false);
            this.reloadPage();
          },
          error: (err: any) => {
            this.errorMessage = err.error.message;
            this.failed = true;
            this.setLoading(false);
          },
        });
    }
    this.errorMessage = "Transfer could not repeated successfully.";
  }
  reloadPage(): void {
    window.location.reload();
  }
}
