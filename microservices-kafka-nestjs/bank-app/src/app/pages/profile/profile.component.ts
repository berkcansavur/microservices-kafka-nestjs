import { Component, OnInit } from "@angular/core";
import { IAccounts } from "src/app/models/accounts.model";
import { ProfileService } from "src/app/services/profile.service";
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
  accounts?: IAccounts = [];
  customers?: object[] = [];
  userActions?: object[] = [];
  transactions?: object[];
  createdAt?: Date;
  updatedAt?: Date;
  open?: boolean = false;
  errorMessage: string = "";
  constructor(
    private profileService: ProfileService,
    private readonly tokenStorage: TokenStorageService,
  ) {}
  content?: string;
  ngOnInit(): void {
    this.userId = this.tokenStorage.getUser()._id.toString();
    this.profileService.getUserBoard(this.userId).subscribe({
      next: (data: any) => {
        this.tokenStorage.saveUser(JSON.stringify(data));
        this.userAge = data.userAge;
      },
      error: (err: any) => {
        this.errorMessage = err.error.message;
      },
    });
    const _user = this.tokenStorage.getUser();
    this.userId = _user.userId;
    this.userName = _user.userName;
    this.userSurname = _user.userSurname;
    this.userAge = _user.userAge;
    console.log(`User Age: ${_user.userAge}`);
    this.userFullName = _user.customerFullName;
    console.log(`User FullName: ${_user.customerFullName}`);
    this.userEmail = _user.email;
    this.bank = _user.bank ?? null;
    this.department = _user.department ?? null;
    this.customerNumber = _user.customerNumber ?? null;
    this.customerSocialSecurityNumber =
      _user.customerSocialSecurityNumber ?? null;
    this.customerRepresentative = _user.customerRepresentative ?? null;
    this.accounts = _user.accounts ?? null;
    this.userActions = _user.userActions ?? null;
    this.customers = _user.customers ?? null;
    this.transactions = _user.transactions ?? null;
    this.createdAt = _user.createdAt ?? null;
    this.updatedAt = _user.updatedAt ?? null;
  }
}
