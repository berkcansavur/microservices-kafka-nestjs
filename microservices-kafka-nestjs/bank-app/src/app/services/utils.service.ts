import { Injectable } from "@angular/core";
import { TokenStorageService } from "./token-storage.service";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  constructor(private readonly tokenStorage: TokenStorageService) {}
  //Setters
  setErrorMessage(errorMessage: string, serverError?: any): string {
    if (serverError) {
      return errorMessage + ": " + serverError;
    } else {
      return errorMessage;
    }
  }
  setLoading(state: boolean): boolean {
    return state;
  }
  setProcess(process: string): string {
    return process;
  }
  //Conditions
  isUserCustomer(): boolean {
    const userType = this.tokenStorage.getUserType();
    if (userType === "CUSTOMER") {
      return true;
    }
    return false;
  }
  isUserEmployee(): boolean {
    const userType = this.tokenStorage.getUserType();
    if (
      userType === "ROLE_CUSTOMER_REPRESENTATIVE" ||
      "ROLE_BANK_DIRECTOR" ||
      "ROLE_BANK_DEPARTMENT_DIRECTOR"
    ) {
      return true;
    }
    return false;
  }
  isUserAdmin(): boolean {
    const userType = this.tokenStorage.getUserType();
    if (userType === "ADMIN") {
      return true;
    }
    return false;
  }
  reloadPage(): void {
    window.location.reload();
  }
}
