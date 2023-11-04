import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class TransferService {
  constructor(private readonly httpClient: HttpClient) {}
  sendGetTransferRequest({
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
  registerCustomer({
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
    try {
      const response = httpClient.post(
        "API",
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
    } catch (error) {
      return error;
    }
  }
  sendGetCustomersTransfersRequest({
    customerId,
  }: {
    customerId: string;
  }): Observable<any> {
    {
      const { httpClient } = this;
      const response = httpClient.get(
        `http://localhost:3000/customers/getCustomersTransfers/${customerId}`,
        httpOptions,
      );
      return response;
    }
  }
  mapTransferStatus(status: number | undefined): string | null {
    if (status === 100) {
      return "Created";
    }
    if (status === 110) {
      return "Approve pending";
    }
    if (status === 200) {
      return "Approved";
    }
    if (status === 320) {
      return "Transfer started";
    }
    if (status === 600) {
      return "Completed";
    }
    if (status === 690) {
      return "Cancel pending";
    }
    if (status === 700) {
      return "Cancelled";
    }
    if (status === 800) {
      return "Failed";
    }
    if (status === 900) {
      return "Rejected";
    }
    if (status === undefined) {
      return null;
    }
    return null;
  }
}
