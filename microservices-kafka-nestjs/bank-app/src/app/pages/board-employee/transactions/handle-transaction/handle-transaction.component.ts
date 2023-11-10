import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { IAccountItem } from "src/app/models/accounts.model";
import { ITransactionItem } from "src/app/models/transactions.model";
import { ITransferItem } from "src/app/models/transfers.model";
import { IUserProfile } from "src/app/models/user-profile.mode";
import { AccountService } from "src/app/services/accounts.service";
import { EmployeeService } from "src/app/services/employee.service";
import { ProfileService } from "src/app/services/profile.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "[app-handle-transaction]",
  templateUrl: "./handle-transaction.component.html",
})
export class HandleTransactionComponent implements OnInit {
  @Input() transaction: ITransactionItem | undefined;

  constructor(
    private readonly tokenStorage: TokenStorageService,
    private readonly utilsService: UtilsService,
    private readonly employeeService: EmployeeService,
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
  ) {}

  //app logic
  process: string = "";
  errorMessage: string = "";
  //conditions
  isLoading: boolean = false;
  //values
  fromAccountUserId: string = "";
  fromAccountUserName: string = "";
  fromAccountId: string = "";
  fromAccountName: string = "";
  fromAccount: string = "";
  toAccountUserId: string = "";
  toAccountUserName: string = "";
  toAccountId: string = "";
  toAccountName: string = "";
  toAccount: string = "";
  employeeId: string = "";
  transferId: string = "";
  transactionType: string = "";
  result: string = "";
  currencyType: string = "";
  amount: number = 0;
  customerId: string = "";
  transfer: ITransferItem | undefined;
  processedTransfer: ITransferItem | undefined;
  occurredAt: Date = new Date();
  ngOnInit(): void {
    this.setTransactionProps();
    this.getAccount(this.fromAccountId).subscribe({
      next: (data: any) => {
        this.fromAccount = data;
        this.fromAccountName = data.accountName;
        this.fromAccountUserId = data.userId;
        this.isLoading = this.utilsService.setLoading(false);
        this.getCustomer(this.transaction?.transfer.userId as string).subscribe(
          {
            next: (data: any) => {
              this.fromAccountUserName = data.userFullName;
            },
            error: (err: any) => {
              console.log("getCustomer Error", err.error);
            },
          },
        );
      },
      error: (err: any) => {
        this.isLoading = this.utilsService.setLoading(false);
        this.errorMessage = this.utilsService.setErrorMessage(
          "Could not retrieved account data",
          err.error.message,
        );
      },
    });
    this.getAccount(this.toAccountId).subscribe({
      next: (data: any) => {
        this.toAccount = data;
        this.toAccountName = data.accountName;
        this.toAccountUserId = data.userId;
        this.isLoading = this.utilsService.setLoading(false);
        this.getCustomer(this.toAccountUserId).subscribe({
          next: (data: any) => {
            this.toAccountUserName = data.userFullName;
          },
          error: (err: any) => {
            console.log("getCustomer Error", err.error);
          },
        });
      },
      error: (err: any) => {
        this.isLoading = this.utilsService.setLoading(false);
        this.errorMessage = this.utilsService.setErrorMessage(
          "Could not retrieved account data",
          err.error.message,
        );
      },
    });
  }
  //setters
  setTransactionProps() {
    this.transactionType = this.transaction?.transactionType as string;
    this.transferId = this.transaction?.transfer?._id as string;
    this.employeeId = this.tokenStorage.getUser()._id;
    this.customerId = this.transaction?.customer as string;
    this.result = this.transaction?.result as string;
    this.currencyType = this.transaction?.transfer?.currencyType as string;
    this.amount = this.transaction?.transfer?.amount as number;
    this.fromAccountId = this.transaction?.transfer?.fromAccount as string;
    this.toAccountId = this.transaction?.transfer?.toAccount as string;
  }
  getCustomer(customerId: string): Observable<IUserProfile> {
    this.process = this.utilsService.setProcess("Getting account...");
    this.isLoading = this.utilsService.setLoading(true);
    return this.profileService.getCustomer({ userId: customerId });
  }
  getAccount(accountId: string): Observable<IAccountItem> {
    this.process = this.utilsService.setProcess("Getting account...");
    this.isLoading = this.utilsService.setLoading(true);
    return this.accountService.sendGetAccountRequest({ accountId });
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
