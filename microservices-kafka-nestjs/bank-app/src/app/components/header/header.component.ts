import { Component, OnInit } from "@angular/core";
import { HEADER_TYPES } from "src/app/constants/app-constants";

import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  headerTypes = Object.values(HEADER_TYPES);
  constructor(private tokenStorage: TokenStorageService) {}
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }
  logOut(): void {
    this.tokenStorage.logOut();
    this.reloadPage();
  }
  setCurrentPage(id: string): void {
    const headerSection = document.getElementById(`${id}`) as HTMLInputElement;
    this.headerTypes.map((header) => {
      document
        .getElementById(`${header}`)
        ?.setAttribute(
          "class",
          "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium",
        );
    });
    headerSection.setAttribute(
      "class",
      "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium",
    );
  }
  reloadPage(): void {
    window.location.reload();
  }
}
