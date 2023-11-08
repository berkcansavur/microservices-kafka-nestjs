import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}
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
