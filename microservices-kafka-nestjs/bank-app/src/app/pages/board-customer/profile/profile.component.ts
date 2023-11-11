import { Component, OnInit } from "@angular/core";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
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
  userAge?: number = 0;
  accounts?: any = [];
  accountsCount: number = 0;
  customers?: object[] = [];
  userActions?: object[] = [];
  transactions?: object[];
  createdAt?: Date;
  updatedAt?: Date;
  open?: boolean = false;
  errorMessage: string = "";
  constructor(private readonly tokenStorage: TokenStorageService) {}
  content?: string;
  ngOnInit(): void {
    const _user = this.tokenStorage.getUser();
    this.setUserProfile(_user);
  }
  //setters
  setUserProfile(_user: any): void {
    console.log("User: ", JSON.stringify(_user));
    this.userId = _user._id;
    this.userName = _user.userName;
    this.userSurname = _user.userSurname;
    this.userAge = _user.userAge;
    this.userFullName = _user.userFullName;
    this.userEmail = _user.userEmail;
    this.bank = _user.bank ?? null;
    this.department = _user.department ?? null;
    this.customerNumber = _user.customerNumber ?? null;
    this.customerSocialSecurityNumber =
      _user.customerSocialSecurityNumber ?? null;
    this.customerRepresentative = _user.customerRepresentative ?? null;
    this.accounts = _user.accounts ?? null;
    this.accountsCount = this.accounts?.length ? this.accounts.length : null;
    this.userActions = _user.userActions ?? null;
    this.customers = _user.customers ?? null;
    this.transactions = _user.transactions ?? null;
    this.createdAt = _user.createdAt ?? null;
    this.updatedAt = _user.updatedAt ?? null;
  }
}
