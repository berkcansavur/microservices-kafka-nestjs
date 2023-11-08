import { Injectable } from "@angular/core";
import { USER_TYPES } from "src/types/user.types";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  constructor(private readonly authService: AuthService) {}
  logOut(): void {
    window.sessionStorage.clear();
    this.setIsLoggedIn("false");
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem("ACCESS_TOKEN");
    window.sessionStorage.setItem("ACCESS_TOKEN", token);
  }
  public getToken(): string | null {
    return window.sessionStorage.getItem("ACCESS_TOKEN");
  }
  public saveUser(user: any): void {
    window.sessionStorage.removeItem("CURRENT_USER");
    window.sessionStorage.setItem("CURRENT_USER", user);
  }
  public getUser(): any {
    const user = window.sessionStorage.getItem("CURRENT_USER");
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
  public setIsLoggedIn(trueOrFalse: string): void {
    window.sessionStorage.setItem("IS_LOGGED_IN", trueOrFalse);
    this.authService.setLoggedInStatus(true);
  }
  public getIsLoggedIn(): boolean {
    const loggedInCondition = window.sessionStorage.getItem("IS_LOGGED_IN");
    if (loggedInCondition === "true") {
      return true;
    } else {
      this.setUserType("null");
      return false;
    }
  }
  public setUserType(userType: string): void {
    window.sessionStorage.setItem("USER_TYPE", userType);
    this.authService.setUserType(userType as USER_TYPES);
  }
  public getUserType(): string | null {
    return window.sessionStorage.getItem("USER_TYPE");
  }
}
