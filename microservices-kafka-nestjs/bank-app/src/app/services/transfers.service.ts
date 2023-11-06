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
  sendCreateMoneyTransferRequest({
    currencyType,
    userId,
    fromAccount,
    toAccount,
    amount,
  }: {
    currencyType: string;
    userId: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
  }): Observable<any> {
    const { httpClient } = this;
    const response = httpClient.post(
      `http://localhost:3000/createTransfer`,
      {
        currencyType,
        userId,
        fromAccount,
        toAccount,
        amount,
      },
      httpOptions,
    );
    return response;
  }
  sendDeleteTransferRecordRequest({
    transferIds,
    userId,
  }: {
    transferIds: string[];
    userId: string;
  }): Observable<any> {
    const { httpClient } = this;
    console.log("Transfer Ids: ", transferIds);
    const response = httpClient.post(
      `http://localhost:3000/deleteTransferRecords`,
      {
        transferIds,
        userId,
      },
      httpOptions,
    );
    return response;
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
    if (status === 1000) {
      return "Deleted";
    }
    if (status === undefined) {
      return null;
    }
    return null;
  }
}
