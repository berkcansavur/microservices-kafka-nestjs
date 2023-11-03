import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatGridListModule } from "@angular/material/sidenav";
import { MatMenuModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/sidenav";
import { MatCardModule } from "@angular/material/sidenav";
import { MatItemModule } from "@angular/material/sidenav";
import { MatExpansionModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/sidenav";
import { MatBadgeModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/sidenav";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatItemModule,
    MatExpansionModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatBadgeModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
