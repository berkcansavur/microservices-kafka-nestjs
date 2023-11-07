import { Component } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { TokenStorageService } from "src/app/services/token-storage.service";

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
  errorMessage: string = "";
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
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
          this.isRegisterFailed = false;
          // this.roles = this.tokenStorage.getUser().role;
          this.reloadPage();
        },
        error: (err: any) => {
          this.errorMessage = err.error.message;
          this.isRegisterFailed = true;
        },
      });
  }
  reloadPage(): void {
    window.location.reload();
  }
  setIsRegisterFailedFalse(): void {
    this.isRegisterFailed = false;
  }
}
