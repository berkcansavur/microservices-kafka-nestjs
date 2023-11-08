import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { UtilsService } from "src/app/services/utils.service";
import { USER_TYPES } from "src/types/user.types";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  //Conditions
  isUserIsCustomer: boolean = false;
  isUserIsEmployee: boolean = false;
  isUserIsAdmin: boolean = false;
  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false;
  isOpen: boolean = false;
  loading: boolean = false;
  //Values
  form: any = {
    userType: null,
    email: null,
    password: null,
  };
  selectedUserType: string = "";
  process: string = "";
  errorMessage: string = "";
  userType: string = "";
  email: string = "";
  password: string = "";
  roles: string[] = [];
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private readonly router: Router,
    private readonly utilsService: UtilsService,
  ) {}
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }
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
  onSelectedUserType(userType: string): void {
    this.isUserIsCustomer = false;
    this.isUserIsEmployee = false;
    this.isUserIsAdmin = false;
    this.selectedUserType = userType;
    this.userType = userType;
    this.isOpen = false;
    const mappedUserType = this.utilsService.checkUserType(
      userType as USER_TYPES,
    );
    if (mappedUserType === "EMPLOYEE") {
      this.isUserIsEmployee = true;
    }
    if (mappedUserType === USER_TYPES.CUSTOMER) {
      this.isUserIsCustomer = true;
    }
    if (mappedUserType === USER_TYPES.ADMIN) {
      this.isUserIsAdmin = true;
    }
  }
  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }
  setEmail(email: string): void {
    this.email = email;
  }
  setPassword(password: string): void {
    this.password = password;
  }
  setLoading(state: boolean) {
    this.loading = state;
  }
  onCustomerSubmit(): void {
    const { email, password } = this.form;
    const { userType } = this;
    this.process = this.utilsService.setProcess(
      `Login ${userType.toLowerCase()}...`,
    );
    this.authService.loginCustomer({ userType, email, password }).subscribe({
      next: (data: any) => {
        this.setLoading(false);
        this.authService.setLoggedInStatus(true);
        this.authService.setUserType(userType as USER_TYPES);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(JSON.stringify(data));
        this.tokenStorage.setIsLoggedIn("true");
        this.tokenStorage.setUserType(userType);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate(["/profile"]);
      },
      error: (err: any) => {
        this.setLoading(false);
        this.errorMessage = this.utilsService.setErrorMessage(
          "Login Failed",
          err.error.message,
        );
        this.isLoginFailed = true;
      },
    });
  }
  onEmployeeSubmit(): void {
    const { email, password } = this.form;
    const { userType } = this;
    this.process = this.utilsService.setProcess(
      `Login ${userType.toLowerCase()}...`,
    );
    this.authService.loginEmployee({ userType, email, password }).subscribe({
      next: (data: any) => {
        this.setLoading(false);
        this.authService.setLoggedInStatus(true);
        this.authService.setUserType(userType as USER_TYPES);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(JSON.stringify(data));
        this.tokenStorage.setIsLoggedIn("true");
        this.tokenStorage.setUserType(userType);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate(["/profile"]);
      },
      error: (err: any) => {
        this.setLoading(false);
        this.errorMessage = this.utilsService.setErrorMessage(
          "Login Failed",
          err.error.message,
        );
        this.isLoginFailed = true;
      },
    });
  }
  onAdminSubmit(): void {
    const { email, password } = this.form;
    const { userType } = this;
    this.process = this.utilsService.setProcess(
      `Login ${userType.toLowerCase()}...`,
    );
    this.authService.loginCustomer({ userType, email, password }).subscribe({
      next: (data: any) => {
        this.setLoading(false);
        this.authService.setLoggedInStatus(true);
        this.authService.setUserType(userType as USER_TYPES);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(JSON.stringify(data));
        this.tokenStorage.setIsLoggedIn("true");
        this.tokenStorage.setUserType(userType);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate(["/profile"]);
      },
      error: (err: any) => {
        this.setLoading(false);
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }
  reloadPage(): void {
    window.location.reload();
  }
  setIsLoginFailedFalse(): void {
    this.isLoginFailed = false;
  }
}
