import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class AccountService {
  constructor(private readonly httpClient: HttpClient) {}
  sendGetAccountRequest({ accountId }: { accountId: string }): Observable<any> {
    const { httpClient } = this;
    try {
      const response = httpClient.get(
        `http://localhost:3000/getAccount/${accountId}`,
        httpOptions,
      );
      return response;
    } catch (err: any) {
      throw new Error(err.error.message);
    }
  }
  sendCreateAccountRequest({
    accountName,
    accountType,
    bankBranchCode,
    userId,
    interest,
  }: {
    accountName: string;
    accountType: string;
    bankBranchCode: string;
    userId: string;
    interest: number;
  }): Observable<any> {
    const { httpClient } = this;
    const response = httpClient.post(
      `http://localhost:3000/customers/createAccount`,
      { accountName, accountType, bankBranchCode, userId, interest },
      httpOptions,
    );
    return response;
  }
  sendGetAccountsLastActionsRequest({
    accountId,
    actionCount,
  }: {
    accountId: string;
    actionCount: number;
  }): Observable<any> {
    const { httpClient } = this;
    const response = httpClient.get(
      `http://localhost:3000/getAccountsLastActions/${accountId}/${actionCount}`,
      httpOptions,
    );
    return response;
  }
  sendGetAccountsBalanceRequest({
    accountId,
  }: {
    accountId: string;
  }): Observable<any> {
    const { httpClient } = this;
    const response = httpClient.get(
      `http://localhost:3000/getAccountsBalance/${accountId}`,
      httpOptions,
    );
    return response;
  }
  sendGetAccountsBalanceOfCurrencyTypeRequest({
    accountId,
    currencyType,
  }: {
    accountId: string;
    currencyType: string;
  }): Observable<any> {
    const { httpClient } = this;
    const response = httpClient.get(
      `http://localhost:3000/getAccountsBalanceOfCurrencyType${accountId}/${currencyType}`,
      httpOptions,
    );
    return response;
  }
  sendGetCustomersAccountsRequest({
    customerId,
  }: {
    customerId: string;
  }): Observable<any> {
    const { httpClient } = this;
    try {
      const response = httpClient.get(
        `http://localhost:3000/customers/getCustomersAccounts/${customerId}`,
        httpOptions,
      );
      return response;
    } catch (err: any) {
      throw new Error(err.error.message);
    }
  }
  mapAccountStatus(status: number | undefined): string | null {
    if (status === 500) {
      return "Created";
    }
    if (status === 1000) {
      return "Banned";
    }
    if (status === 2000) {
      return "Available";
    }
    if (status === 2500) {
      return "Not available";
    }
    if (status === 2100) {
      return "In transaction";
    }
    if (status === 3000) {
      return "Deleted";
    }
    if (status === undefined) {
      return null;
    }
    return null;
  }
}
