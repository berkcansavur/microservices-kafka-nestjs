import { Component, Input, OnInit } from "@angular/core";
import { ITransactionItem } from "src/app/models/transactions.model";
import { ITransferItem } from "src/app/models/transfers.model";
import { EmployeeService } from "src/app/services/employee.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-handle-transaction",
  template: "./handle-transaction.component.html",
})
export class HandleTransactionComponent implements OnInit {
  @Input() transaction: ITransactionItem | undefined;

  constructor(
    private readonly tokenStorage: TokenStorageService,
    private readonly utilsService: UtilsService,
    private readonly employeeService: EmployeeService,
  ) {}
  //app logic
  process: string = "";
  errorMessage: string = "";
  //conditions
  isLoading: boolean = false;
  //values
  employeeId: string = "";
  transferId: string = "";
  transactionType: string = "";
  result: string = "";
  customerId: string = "";
  transfer: ITransferItem | undefined;
  processedTransfer: ITransferItem | undefined;
  occurredAt: Date = new Date();
  ngOnInit(): void {
    this.setTransactionProps();
  }
  //setters
  setTransactionProps() {
    this.transferId = this.transaction?.transfer._id as string;
    this.employeeId = this.tokenStorage.getUser()._id;
    this.customerId = this.transaction?.customer as string;
  }
  //handlers
  rejectTransfer() {
    const { employeeId, transferId } = this;
    this.process = this.utilsService.setProcess("Rejecting transfer...");
    this.isLoading = this.utilsService.setLoading(true);
    this.employeeService
      .sendRejectTransferRequest({ employeeId, transferId })
      .subscribe({
        next: (data: any) => {
          this.processedTransfer = data;
          this.isLoading = this.utilsService.setLoading(false);
        },
        error: (err: any) => {
          this.errorMessage = this.utilsService.setErrorMessage(
            "Could not rejected transfer",
            err.error.message,
          );
          this.isLoading = this.utilsService.setLoading(false);
        },
      });
  }
  approveTransfer() {
    const { employeeId, transferId } = this;
    this.process = this.utilsService.setProcess("Approving transfer...");
    this.isLoading = this.utilsService.setLoading(true);
    this.employeeService
      .sendApproveTransferRequest({ employeeId, transferId })
      .subscribe({
        next: (data: any) => {
          this.processedTransfer = data;
          this.isLoading = this.utilsService.setLoading(false);
        },
        error: (err: any) => {
          this.errorMessage = this.utilsService.setErrorMessage(
            "Could not approved transfer",
            err.error.message,
          );
          this.isLoading = this.utilsService.setLoading(false);
        },
      });
  }
}
