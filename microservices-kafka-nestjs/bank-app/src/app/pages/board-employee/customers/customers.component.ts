import { Component, OnInit } from "@angular/core";
import { IUserProfile } from "src/app/models/user-profile.mode";
import { ProfileService } from "src/app/services/profile.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { UtilsService } from "../../../services/utils.service";
import { EmployeeService } from "src/app/services/employee.service";

@Component({
  selector: "[app-customers]",
  templateUrl: "./customers.component.html",
})
export class CustomersComponent implements OnInit {
  constructor(
    private readonly tokenStorage: TokenStorageService,
    private readonly profileService: ProfileService,
    private readonly utilsService: UtilsService,
    private readonly employeeService: EmployeeService,
  ) {}
  //app logic
  errorMessage: string | undefined;
  process: string | undefined;
  employeeType: string = "";
  employeeId: string = "";
  //conditions
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  isAssignCustomerPanelOpen: boolean = false;
  isActionMenuOpen: boolean = false;
  //values
  searchText: string = "";
  customerId: string = "";
  customers: IUserProfile[] = [];
  customerIds: string[] = [];
  customerRepresentativeId: string = "";
  ngOnInit(): void {
    this.customerRepresentativeId = this.tokenStorage.getUser().userId;
    this.getCustomerRepresentativeData();
    this.setEmployeeProps();
    console.log("id cusrep:", this.customerRepresentativeId);
  }
  //handlers
  handleClickActionMenuPanel() {
    this.isActionMenuOpen = !this.isActionMenuOpen;
  }
  handleSearchCustomer() {
    const { searchText, utilsService, employeeService } = this;
    this.process = utilsService.setProcess("Searching for customers...");
    this.isLoading = utilsService.setLoading(true);
    employeeService.sendSearchCustomerRequest({ searchText }).subscribe({
      next: (data: any) => {
        console.log("search text: ", searchText);
        this.customers.push(data);
        console.log("filtered customer: ", data);
        this.isLoading = utilsService.setLoading(false);
      },
      error: (err: any) => {
        this.errorMessage = utilsService.setErrorMessage(
          "Could not searched for customers",
          err.error.message,
        );
        this.isLoading = utilsService.setLoading(false);
      },
    });
  }
  showCustomersTransactions(customerId: string) {
    const { employeeId, employeeType } = this;
    this.process = this.utilsService.setProcess(
      "Retrieving employees transactions request...",
    );
    this.isLoading = this.utilsService.setLoading(true);
    let transactions = [];
    this.employeeService
      .sendGetEmployeesCustomersTransactionsRequest({
        employeeType,
        employeeId,
        customerId,
      })
      .subscribe({
        next: (data: any) => {
          transactions = data;
          console.log("Transactions: ", transactions);
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
  handleAssignCustomer(customerId: string) {
    console.log("show customers transactions:", customerId);
  }
  handleUnassignCustomer(customerId: string) {
    console.log("show customers transactions:", customerId);
  }
  //getters
  getCustomerRepresentativeData() {
    this.isLoading = this.utilsService.setLoading(true);
    this.process = this.utilsService.setProcess(
      "Retrieving customer representative data...",
    );
    this.profileService
      .getCustomerRepresentative({ userId: this.customerRepresentativeId })
      .subscribe({
        next: (data: any) => {
          data.customers.map((customer: any) => {
            this.customerIds.push(customer._id);
            this.customerIds.map((customerId) => {
              this.getCustomersInfo(customerId);
            });
          });
          this.isLoading = this.utilsService.setLoading(false);
        },
        error: (err: any) => {
          this.isLoading = this.utilsService.setLoading(false);
          this.errorMessage = this.utilsService.setErrorMessage(
            "Retrieving customer data has failed",
            err.error.message,
          );
        },
      });
  }
  getCustomersInfo(customerId: string): void {
    this.isLoading = this.utilsService.setLoading(true);
    this.process = this.utilsService.setProcess("Retrieving customer data...");
    this.profileService.getCustomer({ userId: customerId }).subscribe({
      next: (data: any) => {
        this.customers.push(data);
        this.isLoading = this.utilsService.setLoading(false);
        console.log("Retrieved customer data:", data);
      },
      error: (err: any) => {
        this.isLoading = this.utilsService.setLoading(false);
        this.errorMessage = this.utilsService.setErrorMessage(
          "Retrieving customer data has failed",
          err.error.message,
        );
      },
    });
  }
  //setters
  setAssignCustomerPanelOpen(): void {
    this.isAssignCustomerPanelOpen = !this.isAssignCustomerPanelOpen;
  }
  setEmployeeProps(): void {
    this.employeeType = this.tokenStorage.getUserType() as string;
    this.employeeId = this.tokenStorage.getUser().userId;
  }
}
