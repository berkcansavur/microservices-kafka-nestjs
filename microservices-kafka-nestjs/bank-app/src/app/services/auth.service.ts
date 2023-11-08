import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { USER_TYPES } from "src/types/user.types";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}
  private getUserTypeSubject = new BehaviorSubject<USER_TYPES>(USER_TYPES.NULL);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userType$ = this.getUserTypeSubject.asObservable();

  setUserType(userType: USER_TYPES) {
    this.getUserTypeSubject.next(userType);
  }
  setLoggedInStatus(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }
  loginCustomer({
    userType,
    email,
    password,
  }: {
    userType: string;
    email: string;
    password: string;
  }): Observable<any> {
    const { httpClient } = this;
    const response = httpClient.post(
      "http://localhost:3000/customers/loginCustomer",
      {
        userType,
        email,
        password,
      },
      httpOptions,
    );
    return response;
  }
  loginEmployee({
    userType,
    email,
    password,
  }: {
    userType: string;
    email: string;
    password: string;
  }): Observable<any> {
    const { httpClient } = this;
    const response = httpClient.post(
      "http://localhost:3000/loginEmployee",
      {
        userType,
        email,
        password,
      },
      httpOptions,
    );
    return response;
  }
  registerUser({
    customerName,
    customerSurname,
    customerAge,
    email,
    customerSocialSecurityNumber,
    password,
  }: {
    customerName: string;
    customerSurname: string;
    customerAge: number;
    email: string;
    customerSocialSecurityNumber: number;
    password: string;
  }) {
    const { httpClient } = this;
    const response = httpClient.post(
      `http://localhost:3000/customers/createCustomer`,
      {
        customerName,
        customerSurname,
        customerAge,
        email,
        customerSocialSecurityNumber,
        password,
      },
      httpOptions,
    );
    return response;
  }
}
