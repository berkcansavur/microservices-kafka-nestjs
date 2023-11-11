import { Component } from "@angular/core";
import { CURRENCY_TYPES } from "src/app/constants/transfer-constants";
import { ITransferItem } from "src/app/models/transfers.model";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { TransferService } from "src/app/services/transfers.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "[app-customer-transfer]",
  templateUrl: "./customer-transfer.component.html",
})
export class CustomerTransferComponent {
  constructor(
    private readonly transferService: TransferService,
    private readonly tokenStorage: TokenStorageService,
    private readonly utilsService: UtilsService,
  ) {}
  //Conditions
  isLoggedIn: boolean = false;
  isUserIsCustomer: boolean = false;
  isChecked: boolean = false;
  isTransferPanelOpened: boolean = false;
  isActionDropdownMenuOpened: boolean = false;
  isFilterDropdownMenuOpened: boolean = false;
  isTransferCurrencyOpen: boolean = false;
  loading: boolean = false;
  //Values
  createTransferForm: any = {
    fromAccount: null,
    toAccount: null,
    amount: null,
  };
  process: string = "";
  failed: boolean = false;
  returnedCreatedTransfer: any = null;
  transfers: ITransferItem[] = [];
  deletedTransfers: ITransferItem[] = [];
  transfersToShow: ITransferItem[] = [];
  transferToRepeat: ITransferItem = Object();
  transferIds: string[] = [];
  customerId: string = "";
  selectedCurrencyType: string = "";
  errorMessage: string = "";
  currencyTypes = Object.values(CURRENCY_TYPES);
  ngOnInit(): void {
    this.isAllowedToUserType();
    this.isLoggedIn = this.tokenStorage.getIsLoggedIn();
    this.getCustomersTransfers();
  }
  //Checkers
  isAllowedToUserType() {
    const isAllowed = this.utilsService.isUserCustomer();
    if (isAllowed === true) {
      this.isUserIsCustomer = true;
      this.customerId = this.tokenStorage.getUser().userId.toString();
    } else {
      this.errorMessage = this.utilsService.setErrorMessage(
        "You are not allowed to view this page.",
      );
    }
  }
  //Setters
  setTransferStatus(transfer: ITransferItem) {
    const status: number | undefined = transfer.status;
    const mappedStatus = this.transferService.mapTransferStatus(status);
    return mappedStatus;
  }
  getCustomersTransfers() {
    this.process = this.utilsService.setProcess("Retrieving transfers data...");
    this.loading = this.utilsService.setLoading(true);
    this.transferService
      .sendGetCustomersTransfersRequest({ customerId: this.customerId })
      .subscribe({
        next: (data: any) => {
          this.transfers = data;
          this.loading = this.utilsService.setLoading(false);
          this.transfers.map((transfer) => {
            this.separateDeletedTransfers(transfer);
          });
        },
        error: (err: any) => {
          this.errorMessage = this.utilsService.setErrorMessage(
            "Could not retrieved transfers",
            err.error.message,
          );
          this.loading = this.utilsService.setLoading(false);
        },
      });
  }
  //Filters
  separateDeletedTransfers(transfer: ITransferItem) {
    if (transfer.status === 1000) {
      this.deletedTransfers.push(transfer);
      const updatedTransfers = this.transfers.filter((transfer) => {
        return transfer.status !== 1000;
      });
      this.transfersToShow = updatedTransfers;
    }
  }
  filterTransferStatus(transferStatus: number): void {
    const transfers = this.transfers.filter((transfer) => {
      return transfer.status === transferStatus;
    });
    this.transfersToShow = transfers;
    this.handleClickFilterDropdownMenu();
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
  //Handlers
  handleClickTransferPanel() {
    this.isTransferPanelOpened = !this.isTransferPanelOpened;
  }
  handleRepeatTransfer() {
    const { transferService } = this;
    this.loading = this.utilsService.setLoading(true);
    this.process = this.utilsService.setProcess("Repeating transfer...");
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
            this.loading = this.utilsService.setLoading(false);
            this.utilsService.reloadPage();
          },
          error: (err: any) => {
            this.errorMessage = this.utilsService.setErrorMessage(
              "Transfer could not repeated successfully",
              err.error.message,
            );
            this.failed = true;
            this.loading = this.utilsService.setLoading(false);
          },
        });
    }
  }
  handleDeleteTransferRecord() {
    const { transferService, tokenStorage } = this;
    this.loading = this.utilsService.setLoading(true);
    this.process = this.utilsService.setProcess("Deleting transfers...");
    const transferIds = this.transferIds;
    const userId = tokenStorage.getUser()._id;
    transferService
      .sendDeleteTransferRecordRequest({
        transferIds,
        userId,
      })
      .subscribe({
        next: (data: any) => {
          this.returnedCreatedTransfer = data;
          this.loading = this.utilsService.setLoading(false);
          this.utilsService.reloadPage();
        },
        error: (err: any) => {
          this.errorMessage = this.utilsService.setErrorMessage(
            "Deleting transfers could not succeed",
            err.error.message,
          );
          this.failed = true;
          this.loading = this.utilsService.setLoading(false);
        },
      });
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
  //Events
  toggleTransferTypesMenu() {
    this.isTransferCurrencyOpen = !this.isTransferCurrencyOpen;
  }
  onSelectedCurrencyType(currencyType: string) {
    this.selectedCurrencyType = currencyType;
    this.isTransferCurrencyOpen = !this.isTransferCurrencyOpen;
  }
  onCreateTransferSubmit(): void {
    const { selectedCurrencyType, tokenStorage, transferService } = this;
    const { fromAccount, toAccount, amount } = this.createTransferForm;
    const userId = tokenStorage.getUser()._id;
    this.loading = this.utilsService.setLoading(true);
    this.process = this.utilsService.setProcess("Creating transfer...");
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
          this.loading = this.utilsService.setLoading(false);
          this.utilsService.reloadPage();
        },
        error: (err: any) => {
          this.errorMessage = this.utilsService.setErrorMessage(
            "Transfer could not be created",
            err.error.message,
          );
          this.loading = this.utilsService.setLoading(false);
        },
      });
  }
}
