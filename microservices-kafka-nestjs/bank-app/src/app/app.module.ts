import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatBadgeModule } from "@angular/material/badge";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { authInterceptorProviders } from "./_helpers/auth.interceptor";
import { BoardCustomerComponent } from "./pages/board-customer/board-customer.component";
import { BoardAdminComponent } from "./pages/board-admin/board-admin.component";
import { BoardEmployeeComponent } from "./pages/board-employee/board-employee.component";
import { RegisterComponent } from "./pages/register/register.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CardComponent } from "./components/card/card.component";
import { CreateTransferComponent } from "./components/create-transfer/create-transfer.component";
import { TransfersComponent } from "./pages/transfers/transfers.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { AccountsComponent } from "./pages/accounts/accounts.component";
import { TransactionsComponent } from "./pages/transactions/transactions.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    BoardCustomerComponent,
    BoardAdminComponent,
    BoardEmployeeComponent,
    RegisterComponent,
    CardComponent,
    CreateTransferComponent,
    TransfersComponent,
    SettingsComponent,
    AccountsComponent,
    TransactionsComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatSidenavModule,
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatBadgeModule,
    MatSnackBarModule,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
