import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenStorageService } from "./token-storage.service";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenStorage: TokenStorageService,
  ) {}
  getUserBoard() {
    return this.tokenStorage.getUser();
  }
  getAdminBoard(): Observable<any> {
    return this.httpClient.get("GET_ADMIN_API", {
      responseType: "text",
    });
  }
}
