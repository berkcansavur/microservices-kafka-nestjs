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
      //this.roles = this.tokenStorage.getUser().roles;
      //this.userType = this.tokenStorage.getUser().userType;
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

  onSubmit(): void {
    const { email, password } = this.form;
    const { userType } = this;
    console.log("email:", email, "password:", password, "userType:", userType);
    this.authService.loginUser({ userType, email, password }).subscribe({
      next: (data: any) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(JSON.stringify(data));
        this.tokenStorage.setIsLoggedIn("true");

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        // this.roles = this.tokenStorage.getUser().role;
        this.reloadPage();
      },
      error: (err: any) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }
  reloadPage(): void {
    window.location.reload();
  }
}
