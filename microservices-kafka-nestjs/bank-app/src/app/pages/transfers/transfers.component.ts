import { Component } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "[app-transfers]",
  templateUrl: "./transfer.component.html",
})
export class TransfersComponent {
  constructor(private readonly utilsService: UtilsService) {}
  //Conditions
  isUserIsCustomer: boolean = false;
  isUserIsEmployee: boolean = false;
  isUserIsAdmin: boolean = false;

  ngOnInit(): void {
    this.checkUserType();
  }
  //Checkers
  checkUserType() {
    if (this.utilsService.isUserAdmin()) {
      this.isUserIsAdmin = true;
    }
    if (this.utilsService.isUserEmployee()) {
      this.isUserIsEmployee = true;
    }
    if (this.utilsService.isUserCustomer()) {
      this.isUserIsCustomer = true;
    }
  }
}
