import { Component } from "@angular/core";
import { TokenStorageService } from "./services/token-storage.service";

@Component({
  selector: "app-root",
  template: ` <app-header></app-header>
    <router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  title = "bank-app";
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService) {}
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes("ROLE_ADMIN");
      this.showModeratorBoard = this.roles.includes(
        "ROLE_CUSTOMER_REPRESENTATIVE" ||
          "ROLE_BANK_DIRECTOR" ||
          "ROLE_BANK_DEPARTMENT_DIRECTOR",
      );

      if (user.customerFullName) {
        this.username = user.customerFullName;
      }
      if (user.employeeFullName) {
        this.username = user.employeeFullName;
      }
    }
  }
  logout(): void {
    this.tokenStorageService.logOut();
    window.location.reload();
  }
}
