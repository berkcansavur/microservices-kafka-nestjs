import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private readonly httpClient: HttpClient) {}
  sendGetEmployeesCustomersTransactionsRequest({
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
      `http://localhost:3000/employees/getEmployeesCustomerRelatedTransactionsRequest/${employeeType}/${employeeId}/${customerId}`,
      httpOptions,
    );
    return response;
  }
  sendApproveTransferRequest({
    employeeId,
    transferId,
  }: {
    employeeId: string;
    transferId: string;
  }): Observable<any> {
    const { httpClient } = this;
    const response = httpClient.post(
      `http://localhost:3000/employees/approveTransfer`,
      {
        employeeId,
        transferId,
      },
      httpOptions,
    );
    return response;
  }
  sendRejectTransferRequest({
    employeeId,
    transferId,
  }: {
    employeeId: string;
    transferId: string;
  }): Observable<any> {
    const { httpClient } = this;
    const response = httpClient.post(
      `http://localhost:3000/employees/rejectTransfer`,
      {
        employeeId,
        transferId,
      },
      httpOptions,
    );
    return response;
  }
}
