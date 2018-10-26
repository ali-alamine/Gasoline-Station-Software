import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OperationsComponent} from './operations/operations.component';
import {CountersComponent} from './counters/counters.component';
import { LoginComponent } from './login/login.component';
import { SellLubricantsComponent } from './sell-lubricants/sell-lubricants.component';
import { WashingCarComponent} from './washing-car/washing-car.component'
import { StockComponent} from './stock/stock.component'
import { DebitsComponent} from './debits/debits.component'
import { SettingsComponent} from './settings/settings.component'
import { DebitFormComponent } from './debit-form/debit-form.component';
import { EmployeeComponent } from './employee/employee.component';
import { ClientComponent } from './client/client.component';
import { AccountingComponent } from './accounting/accounting.component';
import { SellAccessoriesComponent } from './sell-accessories/sell-accessories.component';
import { AccountingDetailsComponent } from './accounting-details/accounting-details.component';
import { PaymentCostComponent } from './payment-cost/payment-cost.component';
import { PaymentSupplyComponent } from './payment-supply/payment-supply.component';
import { ReturnComponent } from './return/return.component';


const routes: Routes = [
  
  {
    path:'operations',component:OperationsComponent
  },
  {
    path:'counters',component:CountersComponent 
  },
  {
    path:'login',component:LoginComponent 
  },
  {
    path:'selllub',component:SellLubricantsComponent 
  },
  {
    path:'wash',component:WashingCarComponent 
  },
  {
    path:'stock',component:StockComponent 
  },
  {
    path:'debits',component:DebitsComponent 
  },
  {
    path:'settings',component:SettingsComponent 
  },
  {
    path:'debbiting',component:DebitFormComponent 
  },
  {
    path:'employee',component:EmployeeComponent 
  },
  {
    path:'client',component:ClientComponent 
  },
  {
    path:'sellAcc',component:SellAccessoriesComponent 
  },
  {
    path:'account',component:AccountingComponent 
  },
  {
    path:'accountDetails',component:AccountingDetailsComponent 
  },
  {
    path:'paymentCost',component:PaymentCostComponent 
  },
  {
    path:'paymentSupply',component:PaymentSupplyComponent 
  },
  {
    path:'return',component:ReturnComponent 
  },
  {
    path:'',component:LoginComponent 
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
