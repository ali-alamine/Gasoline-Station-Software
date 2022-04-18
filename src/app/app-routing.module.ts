import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OperationsComponent} from './operations/operations.component';
import {CountersComponent} from './counters/counters.component';
import { LoginComponent } from './login/login.component';
import { SellLubricantsComponent } from './sell-lubricants/sell-lubricants.component';
import { WashingCarComponent} from './washing-car/washing-car.component';
import { StockComponent} from './stock/stock.component';
import { DebitsComponent} from './debits/debits.component';
import { SettingsComponent} from './settings/settings.component';
import { DebitFormComponent } from './debit-form/debit-form.component';
import { EmployeeComponent } from './employee/employee.component';
import { ClientComponent } from './client/client.component';
import { AccountingComponent } from './accounting/accounting.component';
import { SellAccessoriesComponent } from './sell-accessories/sell-accessories.component';
import { AccountingDetailsComponent } from './accounting-details/accounting-details.component';
import { PaymentCostComponent } from './payment-cost/payment-cost.component';
import { PaymentSupplyComponent } from './payment-supply/payment-supply.component';
import { ReturnComponent } from './return/return.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ShiftHistoryDetailsComponent } from './shift-history-details/shift-history-details.component';
import { HistoryComponent } from './history/history.component';
import { HistoryTypeComponent } from './history-type/history-type.component';
import { StartShiftComponent } from './start-shift/start-shift.component';
import { FuelContainerComponent } from './fuel-container/fuel-container.component';
import { SetPricesComponent } from './set-prices/set-prices.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportOptionsComponent } from './report-options/report-options.component';
import { PaymentsReportComponent } from './payments-report/payments-report.component';

const routes: Routes = [
  {
    path: 'operations', component: OperationsComponent
  },
  {
    path: 'counters', component: CountersComponent
  },
  {
    path: 'payments-report', component: PaymentsReportComponent
  },
  {
    path: 'reports', component: ReportsComponent
  },
  {
    path: 'report-options', component: ReportOptionsComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'selllub', component: SellLubricantsComponent
  },
  {
    path: 'wash', component: WashingCarComponent
  },
  {
    path: 'stock', component: StockComponent
  },
  {
    path: 'debits', component: DebitsComponent
  },
  {
    path: 'settings', component: SettingsComponent
  },
  {
    path: 'debbiting', component: DebitFormComponent
  },
  {
    path: 'employee', component: EmployeeComponent
  },
  {
    path: 'client', component: ClientComponent
  },
  {
    path: 'supplier', component: SupplierComponent
  },
  {
    path: 'sellAcc', component: SellAccessoriesComponent
  },
  {
    path: 'account', component: AccountingComponent
  },
  {
    path: 'accountDetails', component: AccountingDetailsComponent
  },
  {
    path: 'paymentCost', component: PaymentCostComponent
  },
  {
    path: 'paymentSupply', component: PaymentSupplyComponent
  },
  {
    path: 'return', component: ReturnComponent
  },
  {
    path: 'history', component: HistoryComponent
  },
  {
    path: 'historyType', component: HistoryTypeComponent
  },
  {
    path: 'shiftHistoryDetails', component: ShiftHistoryDetailsComponent
  },
  {
    path: 'startShift', component: StartShiftComponent
  },
  {
    path: 'fuelContainer', component: FuelContainerComponent
  },
  {
    path: 'setFuelPrices', component: SetPricesComponent
  },
  {
    path: '', component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
