import { Component } from "@angular/core";
import { TokenStorageService } from "./services/token-storage.service";
import { HEADER_TYPES } from "./constants/app-constants";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { USER_TYPES } from "src/types/user.types";
import { UtilsService } from "./services/utils.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  template: ` <app-header></app-header>
    <router-outlet></router-outlet>`,
})
export class AppComponent {
  headerTypes = Object.values(HEADER_TYPES);
  isUserIsCustomer: boolean = false;
  isUserIsEmployee: boolean = false;
  isUserIsAdmin: boolean = false;
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(
    private tokenStorageService: TokenStorageService,
    private readonly utilsService: UtilsService,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.checkUserType();
    });
    this.authService.userType$.subscribe((userType) => {
      if (userType === USER_TYPES.CUSTOMER) {
        this.isUserIsCustomer = true;
        this.isUserIsEmployee = false;
        this.isUserIsAdmin = false;
      }
      if (
        userType === USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE ||
        userType === USER_TYPES.BANK_DEPARTMENT_DIRECTOR ||
        userType === USER_TYPES.BANK_DIRECTOR
      ) {
        this.isUserIsEmployee = true;
        this.isUserIsAdmin = false;
        this.isUserIsCustomer = false;
      }
      if (userType === USER_TYPES.ADMIN) {
        this.isUserIsAdmin = true;
        this.isUserIsEmployee = false;
        this.isUserIsCustomer = false;
      }
    });
  }
  checkUserType() {
    if (this.utilsService.isUserAdmin()) {
      this.isUserIsAdmin = true;
      this.isLoggedIn = true;
      console.log("Checking is logged in ", this.isLoggedIn);
    }
    if (this.utilsService.isUserEmployee()) {
      this.isUserIsEmployee = true;
      this.isLoggedIn = true;
      console.log("Checking is logged in ", this.isLoggedIn);
    }
    if (this.utilsService.isUserCustomer()) {
      this.isUserIsCustomer = true;
      this.isLoggedIn = true;
      console.log("Checking is logged in ", this.isLoggedIn);
    }
  }
  logOut(): void {
    this.tokenStorageService.logOut();
    this.isLoggedIn = false;
    this.router.navigate(["/login"]);
  }
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
