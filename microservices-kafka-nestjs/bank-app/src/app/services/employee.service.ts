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
  sendGetEmployeesAccountRequest({
    employeeType,
    employeeId,
    customerId,
  }: {
    employeeType: string;
    employeeId: string;
    customerId: string;
  }): Observable<any> {
    const { httpClient } = this;
    const response = httpClient.get(
      `http://localhost:3000/getAgetEmployeesCustomerRelatedTransactionsRequestccount/${employeeType}/${employeeId}/${customerId}`,
      httpOptions,
    );
    return response;
  }
}
