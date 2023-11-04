import { Component, OnInit } from "@angular/core";
import { ProfileService } from "src/app/services/profile.service";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "app-board-employee",
  template: "./board-employee.component.html",
})
export class BoardAdminComponent implements OnInit {
  user: any = null;
  userId: string = "";
  userName: string = "";
  userSurname: string = "";
  bank?: string = "";
  department?: string = "";
  userFullName: string = "";
  userEmail: string = "";
  customerNumber?: number = 0;
  customerSocialSecurityNumber?: number = 0;
  customerRepresentative?: object = {};
  userAge: number = 0;
  accounts?: object[] = [];
  customers?: object[] = [];
  userActions?: object[] = [];
  transactions?: object[];
  createdAt?: Date;
  updatedAt?: Date;
  open?: boolean = false;
  errorMessage: string = "";
  constructor(
    private profileService: ProfileService,
    private tokenStorage: TokenStorageService,
  ) {}
  content?: string;
  ngOnInit(): void {
    // const _user = this.profileService
    //   .getUserBoard({ userId: this.userId })
    //   .subscribe({
    //     next: (data: any) => {
    //       this.userId = this.tokenStorage.getUser()._id.toString();
    //       this.userName = data.userName;
    //       this.userSurname = data.userSurname;
    //       this.userAge = data.userAge;
    //       this.userFullName = data.customerFullName;
    //       this.userEmail = data.email;
    //       this.bank = data.bank ?? null;
    //       this.department = data.department ?? null;
    //       this.customerNumber = data.customerNumber ?? null;
    //       this.customerSocialSecurityNumber =
    //         data.customerSocialSecurityNumber ?? null;
    //       this.customerRepresentative = data.customerRepresentative ?? null;
    //       this.accounts = data.accounts ?? null;
    //       this.userActions = data.userActions ?? null;
    //       this.customers = data.customers ?? null;
    //       this.transactions = data.transactions ?? null;
    //       this.createdAt = data.createdAt ?? null;
    //       this.updatedAt = data.updatedAt ?? null;
    //     },
    //     error: (err: any) => {
    //       this.errorMessage = err.error.message;
    //     },
    //   });
  }
}
