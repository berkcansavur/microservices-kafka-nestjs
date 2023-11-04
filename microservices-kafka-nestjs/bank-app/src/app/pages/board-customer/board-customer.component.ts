import { Component, OnInit } from "@angular/core";
import { ProfileService } from "src/app/services/profile.service";

@Component({
  selector: "app-board-employee",
  template: "./board-employee.component.html",
})
export class BoardCustomerComponent implements OnInit {
  user: any = null;
  userFullName: string = "";
  userEmail: string = "";
  customerNumber?: number = 0;
  customerSocialSecurityNumber?: number = 0;
  userAge: number = 0;
  accounts: any[] = [];
  userActions: any[] = [];
  open?: boolean = false;
  constructor(private profileService: ProfileService) {}
  content?: string;
  ngOnInit(): void {
    // const _user = this.profileService.getUserBoard();
    // this.userFullName = _user.customerFullName;
    // this.userEmail = _user.email;
    // this.customerNumber = _user.customerNumber;
    // this.customerSocialSecurityNumber = _user.customerSocialSecurityNumber;
    // this.userAge = _user.customerAge;
    // this.accounts = _user.accounts;
    // this.userActions = _user.customerActions;
  }
}
