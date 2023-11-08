import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HEADER_TYPES } from "src/app/constants/app-constants";

import { TokenStorageService } from "src/app/services/token-storage.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  headerTypes = Object.values(HEADER_TYPES);
  isUserIsCustomer: boolean = false;
  isUserIsEmployee: boolean = false;
  isUserIsAdmin: boolean = false;
  constructor(
    private tokenStorage: TokenStorageService,
    private readonly router: Router,
    private readonly utilsService: UtilsService,
  ) {}
  ngOnInit(): void {
    this.checkUserType();
    this.isLoggedIn = !!this.tokenStorage.getToken();
  }
  //Checkers
  checkUserType() {
    if (this.utilsService.isUserAdmin()) {
      this.isUserIsAdmin = true;
      this.isLoggedIn = true;
    }
    if (this.utilsService.isUserEmployee()) {
      this.isUserIsEmployee = true;
      this.isLoggedIn = true;
    }
    if (this.utilsService.isUserCustomer()) {
      this.isUserIsCustomer = true;
      this.isLoggedIn = true;
    }
  }
  //Authentication
  logOut(): void {
    this.tokenStorage.logOut();
    this.isLoggedIn = false;
    this.router.navigate(["/login"]);
  }
  //Handlers
  setCurrentPage(id: string): void {
    const headerSection = document.getElementById(`${id}`) as HTMLInputElement;
    this.headerTypes.map((header) => {
      document
        .getElementById(`${header}`)
        ?.setAttribute(
          "class",
          "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium",
        );
    });
    headerSection.setAttribute(
      "class",
      "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium",
    );
  }
}
