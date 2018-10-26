import { Component, OnInit } from '@angular/core';
import { AccountingComponent } from '../accounting/accounting.component';

@Component({
  selector: 'app-accounting-details',
  templateUrl: './accounting-details.component.html',
  styleUrls: ['./accounting-details.component.scss']
})
export class AccountingDetailsComponent implements OnInit {

  constructor(private AccountingComponent:AccountingComponent,) { }

  ngOnInit() {
    // console.log(AccountingComponent.empIDForm.value)
  }

}
