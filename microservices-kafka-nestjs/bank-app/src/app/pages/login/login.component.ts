import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  form: any = {
    userType: null,
    email: null,
    password: null,
  };
  isLoggedIn: boolean = false;
  loading: boolean = false;
  isLoginFailed: boolean = false;
  selectedUserType: string = "";
  isOpen: boolean = false;
  errorMessage: string = "";
  userType: string = "";
  email: string = "";
  password: string = "";
  roles: string[] = [];
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
  ) {}
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }
  onSelectedUserType(userType: string): void {
    console.log("userType: " + userType);
    this.selectedUserType = userType;
    this.userType = userType;
    this.isOpen = false;
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
  onSubmit(): void {
    const { email, password } = this.form;
    const { userType } = this;
    console.log("email:", email, "password:", password, "userType:", userType);
    this.authService.loginUser({ userType, email, password }).subscribe({
      next: (data: any) => {
        this.setLoading(false);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(JSON.stringify(data));
        this.tokenStorage.setIsLoggedIn("true");
        this.tokenStorage.setUserType(userType);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        // this.roles = this.tokenStorage.getUser().role;
        this.reloadPage();
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
