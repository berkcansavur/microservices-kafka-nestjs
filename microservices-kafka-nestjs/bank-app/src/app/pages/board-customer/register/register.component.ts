import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  form: any = {
    customerName: null,
    customerSurname: null,
    customerAge: null,
    email: null,
    customerSocialSecurityNumber: null,
    password: null,
  };
  isRegisterFailed: boolean = false;
  isLoggedIn: boolean = false;
  process: string = "";
  errorMessage: string = "";

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private readonly utilsService: UtilsService,
    private readonly router: Router,
  ) {}
  onSubmit(): void {
    const {
      customerName,
      customerSurname,
      customerAge,
      email,
      customerSocialSecurityNumber,
      password,
    } = this.form;
    this.process = this.utilsService.setProcess("Register user");
    this.authService
      .registerUser({
        customerName,
        customerSurname,
        customerAge,
        email,
        customerSocialSecurityNumber,
        password,
      })
      .subscribe({
        next: () => {
          this.tokenStorage.setUserType("CUSTOMER");
        },
        error: (err: any) => {
          this.errorMessage = err.error.message;
          this.isRegisterFailed = true;
        },
      });
    this.process = this.utilsService.setProcess("Login user");
    this.authService
      .loginCustomer({ userType: "CUSTOMER", email, password })
      .subscribe({
        next: (data: any) => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          this.isLoggedIn = true;
          this.tokenStorage.setUserType("CUSTOMER");
          this.router.navigate(["/profile"]);
        },
        error: (err: any) => {
          this.errorMessage = this.utilsService.setErrorMessage(
            "Error occurred in login process",
            err.error.message,
          );
        },
      });
  }
  reloadPage(): void {
    window.location.reload();
  }
}
