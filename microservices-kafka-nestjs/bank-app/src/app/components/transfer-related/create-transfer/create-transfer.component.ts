import { Component, Input, OnInit } from "@angular/core";
import { CURRENCY_TYPES } from "src/app/constants/transfer-constants";
import { IAccountItem } from "src/app/models/accounts.model";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { TransferService } from "src/app/services/transfers.service";

@Component({
  selector: "[app-create-transfer]",
  templateUrl: "./create-transfer.component.html",
})
export class CreateTransferComponent implements OnInit {
  @Input() account: IAccountItem | undefined;
  constructor(
    private readonly transferService: TransferService,
    private readonly tokenStorage: TokenStorageService,
  ) {}
  createTransferForm: any = {
    toAccount: null,
    amount: null,
    approve: null,
  };
  ngOnInit(): void {
    this.setFromAccountId();
    console.log(this.fromAccount);
  }
  fromAccount: string = "";
  process: string = "";
  loading: boolean = false;
  isTransferCurrencyOpen: boolean = false;
  returnedCreatedTransfer: any = null;
  selectedCurrencyType: string = "";
  currencyTypes = Object.values(CURRENCY_TYPES);
  errorMessage: string = "";
  toggleTransferTypesMenu() {
    this.isTransferCurrencyOpen = !this.isTransferCurrencyOpen;
  }
  onSelectedCurrencyType(currencyType: string) {
    this.selectedCurrencyType = currencyType;
    this.isTransferCurrencyOpen = !this.isTransferCurrencyOpen;
  }
  setFromAccountId() {
    this.account ? (this.fromAccount = this.account._id) : null;
  }
  setLoading(state: boolean) {
    this.loading = state;
  }
  setProcess(process: string) {
    this.process = process;
  }
  setError(errorMessage: string) {
    this.errorMessage = errorMessage;
  }
  checkAllFieldsAreFulfilled(): boolean {
    const checkbox = document.getElementById(`terms`) as HTMLInputElement;
    if (
      !this.createTransferForm.amount ||
      !this.createTransferForm.toAccount ||
      !checkbox.checked
    ) {
      this.errorMessage = "Please fill empty fields";
      this.process = "Create Transfer";
      return false;
    }
    return true;
  }
  onCreateTransferSubmit(): void {
    const { selectedCurrencyType, tokenStorage, transferService, fromAccount } =
      this;
    const { toAccount, amount } = this.createTransferForm;
    const userId = tokenStorage.getUser()._id;
    this.setLoading(true);
    this.setProcess("Create transfer");
    const result = this.checkAllFieldsAreFulfilled();
    if (result === true) {
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
          },
          error: (err: any) => {
            this.errorMessage = err.error.message;
            this.setLoading(false);
          },
        });
    }
    if (result === false) {
      this.setError("Please fill empty fields");
    }
  }
  reloadPage(): void {
    window.location.reload();
  }
}
