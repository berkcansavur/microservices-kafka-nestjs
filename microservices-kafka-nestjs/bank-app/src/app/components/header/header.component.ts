import { Component, OnInit } from "@angular/core";

import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
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
  reloadPage(): void {
    window.location.reload();
  }
}
