import { Component, OnInit } from "@angular/core";
import { ITransactionItem } from "src/app/models/transactions.model";
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
  //values
  employeeType: string = "";
  employeeId: string = "";
  customerId: string = "";
  transactions: ITransactionItem[] = [];
  ngOnInit(): void {
    this.setEmployeeProps();
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
        employeeId,
        customerId,
      })
      .subscribe({
        next: (data: any) => {
          this.transactions = data;
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
}
