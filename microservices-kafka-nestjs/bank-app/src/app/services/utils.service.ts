import { Injectable } from "@angular/core";
import { TokenStorageService } from "./token-storage.service";
import { USER_TYPES } from "src/types/user.types";

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
    if (userType?.toString() === "CUSTOMER") {
      return true;
    }
    return false;
  }
  isUserEmployee(): boolean {
    const userType = this.tokenStorage.getUserType();
    if (
      userType?.toString() === "CUSTOMER_REPRESENTATIVE" ||
      userType?.toString() === "BANK_DIRECTOR" ||
      userType?.toString() === "BANK_DEPARTMENT_DIRECTOR"
    ) {
      return true;
    }
    return false;
  }
  isUserAdmin(): boolean {
    const userType = this.tokenStorage.getUserType();
    if (userType?.toString() === "ADMIN") {
      return true;
    }
    return false;
  }
  reloadPage(): void {
    window.location.reload();
  }
  checkUserType(userType: USER_TYPES): string | null {
    if (userType === "CUSTOMER") {
      return "CUSTOMER";
    }
    if (
      userType === "BANK_DIRECTOR" ||
      userType === "BANK_DEPARTMENT_DIRECTOR" ||
      userType === "BANK_CUSTOMER_REPRESENTATIVE"
    ) {
      return "EMPLOYEE";
    }
    if (userType === "ADMIN") {
      return "ADMIN";
    } else {
      return null;
    }
  }
}
