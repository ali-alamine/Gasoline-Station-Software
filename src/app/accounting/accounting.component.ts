import { Component, OnInit } from '@angular/core';
import { AccountingService } from './accounting.service';
@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements OnInit {
  allLubInvoice:any;
  constructor(private accServ:AccountingService) { }

  ngOnInit() {
  }

  getThisShiftSummary(){
   
  }
  getSoldLubricants(){
    this.accServ.getSoldLubricants().subscribe(
      Response=>{
        this.allLubInvoice=Response;
      },
      error=>{
        alert("error");
      });
  }

}
