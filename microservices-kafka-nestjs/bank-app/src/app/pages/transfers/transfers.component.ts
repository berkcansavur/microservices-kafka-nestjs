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
  deletedTransfers: ITransferItem[] = [];
  transfersToShow: ITransferItem[] = [];
  transferToRepeat: ITransferItem = Object();
  transferIds: string[] = [];
  customerId: string = "";
  selectedCurrencyType: string = "";
  errorMessage: string = "";
  isTransferPanelOpened: boolean = false;
  isActionDropdownMenuOpened: boolean = false;
  isFilterDropdownMenuOpened: boolean = false;
  isTransferCurrencyOpen: boolean = false;
  currencyTypes = Object.values(CURRENCY_TYPES);
  ngOnInit(): void {
    this.customerId = this.tokenStorage.getUser()._id.toString();
    this.setCustomersTransfers();
  }
  setCustomersTransfers() {
    this.setProcess("Get transfers");
    this.setLoading(true);
    this.transferService
      .sendGetCustomersTransfersRequest({ customerId: this.customerId })
      .subscribe({
        next: (data: any) => {
          this.transfers = data;
          console.log("Transfers: ", this.transfers);
          this.setLoading(false);
          this.transfers.map((transfer) => {
            this.separateDeletedTransfers(transfer);
          });
        },
        error: (err: any) => {
          this.errorMessage = err.error.message;
          this.setLoading(false);
        },
      });
  }
  filterTransferStatus(transferStatus: number): void {
    const transfers = this.transfers.filter((transfer) => {
      console.log("Transfer status in map: ", transfer.status);
      return transfer.status === transferStatus;
    });
    console.log("transferStatus", transferStatus);
    console.log("Filtered transfers", transfers);
    this.transfersToShow = transfers;
    this.handleClickFilterDropdownMenu();
  }
  separateDeletedTransfers(transfer: ITransferItem) {
    if (transfer.status === 1000) {
      this.deletedTransfers.push(transfer);
      const updatedTransfers = this.transfers.filter((transfer) => {
        return transfer.status !== 1000;
      });
      this.transfersToShow = updatedTransfers;
    }
  }
  showAllTransfers(): void {
    this.transfersToShow = this.transfers;
    this.handleClickFilterDropdownMenu();
  }
  resetFilter(): void {
    this.transfers.map((transfer) => {
      this.separateDeletedTransfers(transfer);
    });
    this.handleClickFilterDropdownMenu();
  }
  setTransferStatus(transfer: ITransferItem) {
    const status: number | undefined = transfer.status;
    const mappedStatus = this.transferService.mapTransferStatus(status);
    return mappedStatus;
  }
  handleClickTransferPanel() {
    this.isTransferPanelOpened = !this.isTransferPanelOpened;
  }
  handleClickActionDropdownMenu() {
    this.isActionDropdownMenuOpened = !this.isActionDropdownMenuOpened;
    if (this.isFilterDropdownMenuOpened === true) {
      this.isFilterDropdownMenuOpened = !this.isFilterDropdownMenuOpened;
    }
  }
  handleClickFilterDropdownMenu() {
    this.isFilterDropdownMenuOpened = !this.isFilterDropdownMenuOpened;
    if (this.isActionDropdownMenuOpened === true) {
      this.isActionDropdownMenuOpened = !this.isActionDropdownMenuOpened;
    }
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
  handleDeleteTransferRecord() {
    const { transferService, tokenStorage } = this;
    this.setLoading(true);
    this.setProcess("Delete transfers");
    console.log("Transfer: ", JSON.stringify(this.transferToRepeat));
    const transferIds = this.transferIds;
    const userId = tokenStorage.getUser()._id;
    console.log("Transfer: ", JSON.stringify(transferIds));
    transferService
      .sendDeleteTransferRecordRequest({
        transferIds,
        userId,
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
  reloadPage(): void {
    window.location.reload();
  }
}
