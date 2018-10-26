import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import {MatIconRegistry} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OperationsComponent } from './operations/operations.component';
import { MatTabsModule} from '@angular/material/tabs';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatFormFieldModule} from '@angular/material/form-field';
import { CountersComponent } from './counters/counters.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { MatButtonModule, MatCheckboxModule} from '@angular/material'
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatDividerModule} from '@angular/material/divider';
import { MatCardModule} from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { SellLubricantsComponent } from './sell-lubricants/sell-lubricants.component';
import { MatExpansionModule} from '@angular/material/expansion';
import { WashingCarComponent } from './washing-car/washing-car.component';
import { MatDialogModule} from '@angular/material/dialog';
import { StockComponent } from './stock/stock.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MatTableModule} from '@angular/material/table';
import { DebitsComponent } from './debits/debits.component';
import { SettingsComponent } from './settings/settings.component';
import { DebitFormComponent } from './debit-form/debit-form.component';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee/employee.component';
import { ClientComponent } from './client/client.component';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSelectModule} from '@angular/material/select';
import { MatPaginatorModule} from '@angular/material/paginator';
import { SellAccessoriesComponent } from './sell-accessories/sell-accessories.component';
import { AccountingComponent } from './accounting/accounting.component';
import { MatListModule} from '@angular/material/list';
import { AccountingDetailsComponent } from './accounting-details/accounting-details.component';
import { PaymentCostComponent } from './payment-cost/payment-cost.component';
import { PaymentSupplyComponent } from './payment-supply/payment-supply.component';
import { ReturnComponent } from './return/return.component';
@NgModule({
    declarations: [
    AppComponent,
    OperationsComponent,
    CountersComponent,
    LoginComponent,
    SellLubricantsComponent,
    WashingCarComponent,
    StockComponent,
    SideBarComponent,
    DebitsComponent,
    SettingsComponent,
    DebitFormComponent,
    EmployeeComponent,
    ClientComponent,
    SellAccessoriesComponent,
    AccountingComponent,
    AccountingDetailsComponent,
    PaymentCostComponent,
    PaymentSupplyComponent,
    ReturnComponent
  ],
  imports: [
    MatCardModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    MatTabsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDialogModule,
    MatTableModule,
    MatAutocompleteModule,
    FormsModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
