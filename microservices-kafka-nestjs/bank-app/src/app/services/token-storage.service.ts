import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService implements OnInit {
  constructor() {}
  userType: string | null = window.sessionStorage.getItem("USER_TYPE");
  isLoggedIn: boolean | null = false;

  private userTypeSubject = new BehaviorSubject<string | null>(this.userType);
  private isLoggedInSubject = new BehaviorSubject<boolean | null>(
    this.isLoggedIn,
  );
  isLoggedIn$: Observable<boolean | null> =
    this.isLoggedInSubject.asObservable();
  userType$: Observable<string | null> = this.userTypeSubject.asObservable();

  ngOnInit(): void {
    this.userType = window.sessionStorage.getItem("USER_TYPE");
    this.isLoggedIn = this.getIsLoggedIn();
    console.log("TokenStorageService", this.userType);
  }
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
    this.isLoggedInSubject.next(true);
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
    this.userTypeSubject.next(userType);
  }
  public getUserType(): string | null {
    return window.sessionStorage.getItem("USER_TYPE");
  }
}
