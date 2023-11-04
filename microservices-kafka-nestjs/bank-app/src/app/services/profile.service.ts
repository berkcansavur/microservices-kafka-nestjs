import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenStorageService } from "./token-storage.service";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenStorage: TokenStorageService,
  ) {}
  getUserBoard(userId: string): Observable<any> {
    const userType = this.tokenStorage.getUserType();
    const response = this.httpClient.get(
      `http://localhost:3000/getUserProfile/${userType}/${userId}`,
      httpOptions,
    );
    return response;
  }
  getAdminBoard(): Observable<any> {
    return this.httpClient.get("GET_ADMIN_API", {
      responseType: "text",
    });
  }
}
