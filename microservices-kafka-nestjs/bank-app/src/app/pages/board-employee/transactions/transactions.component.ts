import { Component, OnInit } from "@angular/core";
import { ITransactionItem } from "src/app/models/transactions.model";
import { ITransferItem } from "src/app/models/transfers.model";
import { EmployeeService } from "src/app/services/employee.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
})
export class TransactionsComponent implements OnInit {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly tokenStorage: TokenStorageService,
    private readonly utilsService: UtilsService,
  ) {}
  //app logic
  process: string = "";
  errorMessage: string = "";
  //conditions
  isLoading: boolean = false;
  isActionDropdownMenuOpened: boolean = false;
  isFilterDropdownMenuOpened: boolean = false;
  isTransactionPanelOpened: boolean = false;
  isLoggedIn: boolean = false;
  //values
  employeeType: string = "";
  employeeId: string = "";
  customerId: string = "";
  transactions: ITransactionItem[] = [];
  transferIds: string[] = [];
  transferToApprove: ITransferItem | undefined;
  ngOnInit(): void {
    this.setEmployeeProps();
    this.isLoggedIn = this.tokenStorage.getIsLoggedIn();
    this.handleSendGetEmployeesCustomersRelatedTransactionsRequest();
  }
  setEmployeeProps(): void {
    this.employeeType = this.tokenStorage.getUserType() as string;
    this.employeeId = this.tokenStorage.getUser()._id;
  }
  handleSendGetEmployeesCustomersRelatedTransactionsRequest() {
    const { employeeId, employeeType, customerId } = this;
    this.process = this.utilsService.setProcess(
      "Retrieving customer related transactions request...",
    );
    this.isLoading = this.utilsService.setLoading(true);
    this.employeeService
      .sendGetEmployeesCustomersTransactionsRequest({
        employeeType,
        employeeId: "65419d013be4f99e84946a2e",
        customerId: "6540ec554e0d15fad56e8f67",
      })
      .subscribe({
        next: (data: any) => {
          this.transactions = data;
          console.log("Transactions: ", this.transactions);
          this.isLoading = this.utilsService.setLoading(false);
        },
        error: (err: any) => {
          this.errorMessage = this.utilsService.setErrorMessage(
            "Could not retrieved employees customer related transactions",
            err.error.message,
          );
          this.isLoading = this.utilsService.setLoading(false);
        },
      });
  }
  filterSameBankTransactions() {}

  showAllTransactions() {}

  handleClickTransferPanel() {
    this.isTransactionPanelOpened = !this.isTransactionPanelOpened;
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
  handleClickCheckbox(transaction: ITransactionItem) {
    const checkbox = document.getElementById(
      `checkbox-table-search-${transaction.transfer._id}`,
    ) as HTMLInputElement;
    if (
      checkbox.checked === true &&
      !this.transferIds.includes(transaction.transfer._id)
    ) {
      this.transferIds.push(transaction.transfer._id);
      this.transferToApprove = transaction.transfer;
    }
    if (
      checkbox.checked === false &&
      this.transferIds.includes(transaction.transfer._id)
    ) {
      const ids = this.transferIds.filter((id) => {
        return id !== transaction.transfer._id;
      });
      this.transferIds = ids;
    }
  }
  handleClickMasterCheckbox() {
    const checkbox = document.getElementById(
      "checkbox-all-search",
    ) as HTMLInputElement;
    if (checkbox.checked == true) {
      this.transactions.map((transaction) => {
        const singleCheckbox = document.getElementById(
          `checkbox-table-search-${transaction.transfer._id}`,
        ) as HTMLInputElement;
        if (singleCheckbox.checked !== true) {
          singleCheckbox.click();
        }
      });
    }
    if (checkbox.checked == false) {
      this.transactions.map((transaction) => {
        const singleCheckbox = document.getElementById(
          `checkbox-table-search-${transaction.transfer._id}`,
        ) as HTMLInputElement;
        if (singleCheckbox.checked === true) {
          singleCheckbox.click();
        }
      });
    }
  }
}
