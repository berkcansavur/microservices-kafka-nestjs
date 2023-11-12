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
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { ProfileComponent } from "./pages/board-customer/profile/profile.component";
import { authInterceptorProviders } from "./_helpers/auth.interceptor";
import { BoardEmployeeComponent } from "./pages/board-employee/board-employee.component";
import { RegisterComponent } from "./pages/board-customer/register/register.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CreateTransferComponent } from "./pages/board-customer/components/transfer-related/create-transfer/create-transfer.component";
import { TransfersComponent } from "./pages/transfers/transfers.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { AccountsComponent } from "./pages/accounts/accounts.component";
import { TransactionsComponent } from "./pages/board-employee/transactions/transactions.component";
import { DashboardComponent } from "./pages/board-customer/dashboard/dashboard.component";
import { LoadingComponent } from "./common/components/loading/loading.component";
import { AppErrorComponent } from "./common/components/app-error/app-error.component";
import { AccountItemComponent } from "./pages/board-customer/components/account-related/account-item/account-item.component";
import { StepComponentComponent } from "./common/components/step-component/step-component.component";
import { CreatedTransferComponent } from "./pages/board-customer/components/transfer-related/create-transfer/created-transfer/created-transfer.component";
import { CreateAccountComponent } from "./pages/board-customer/components/account-related/create-account/create-account.component";
import { AccountActionsComponent } from "./pages/board-customer/components/account-related/account-item/account-actions/account-actions.component";
import { CreatedAccountComponent } from "./pages/board-customer/components/account-related/create-account/created-account/created-account.component";
import { CustomerTransferComponent } from "./pages/board-customer/customer-transfer/customer-transfer.component";
import { CustomerAccountComponent } from "./pages/board-customer/customer-account/customer-account.component";
import { AssignCustomerComponent } from "./assign-customer/assign-customer.component";
import { BankRepresentativeTransactionsComponent } from "./bank-representative-transactions/bank-representative-transactions.component";
import { TokenStorageService } from "./services/token-storage.service";
import { AuthService } from "./services/auth.service";
import { CustomersComponent } from "./pages/board-employee/customers/customers.component";
import { HandleTransactionComponent } from "./pages/board-employee/transactions/handle-transaction/handle-transaction.component";
import { AssignCustomerToRepresentativeComponent } from './pages/board-employee/customers/assign-customer-to-representative/assign-customer-to-representative.component';
import { SuccessComponent } from './common/components/success/success.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    BoardEmployeeComponent,
    RegisterComponent,
    CreateTransferComponent,
    TransfersComponent,
    SettingsComponent,
    AccountsComponent,
    TransactionsComponent,
    DashboardComponent,
    LoadingComponent,
    AppErrorComponent,
    AccountItemComponent,
    StepComponentComponent,
    CreatedTransferComponent,
    CreateAccountComponent,
    AccountActionsComponent,
    CreatedAccountComponent,
    CustomerTransferComponent,
    CustomerAccountComponent,
    AssignCustomerComponent,
    BankRepresentativeTransactionsComponent,
    CustomersComponent,
    HandleTransactionComponent,
    AssignCustomerToRepresentativeComponent,
    SuccessComponent,
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
  providers: [authInterceptorProviders, TokenStorageService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
