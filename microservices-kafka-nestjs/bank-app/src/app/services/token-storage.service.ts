import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  constructor() {}
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
      console.log("Current User: ", JSON.parse(user));
      return JSON.parse(user);
    }
    return {};
  }
  public setIsLoggedIn(trueOrFalse: string): void {
    window.sessionStorage.setItem("IS_LOGGED_IN", trueOrFalse);
  }
}
