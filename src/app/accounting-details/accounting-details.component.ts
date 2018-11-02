import { Component, OnInit } from '@angular/core';
import { AccountingComponent } from '../accounting/accounting.component';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { AccountingService } from '../accounting/accounting.service';

@Component({
  selector: 'app-accounting-details',
  templateUrl: './accounting-details.component.html',
  styleUrls: ['./accounting-details.component.scss']
})
export class AccountingDetailsComponent implements OnInit {
  private urlData;
  type;
  empIDs;
  totalAmount = 0;
  details;
  isDebit;
  isOpened = 0;

  constructor(private router: Router, private route: ActivatedRoute,private accountingServ:AccountingService,) { }

  ngOnInit() {
    this.urlData = this.route.queryParams.subscribe(params => {
      this.type = params['type'] || -1;
      this.isDebit = params['isDebit'] || -1;
    });
    this.empIDs=localStorage.getItem('empIDs');
    console.log(this.empIDs)
    this.getTypeDetails();
    // console.log(AccountingComponent.empIDForm.value)
  }
  getTypeDetails(){
    let data={"type":this.type,"empIDs":this.empIDs};
    console.log(data);
    this.accountingServ.getTypeDetails(data).subscribe(Response=>{
      console.log(Response)
      if(Response!=0){
        this.details=Response;
        if(this.type == 'debits'){
          this.details.forEach(element => {
            this.totalAmount = this.totalAmount + parseInt(element['rest']);
          });
        } else if (this.type == 'access' || this.type == 'lub' || this.type == 'supply'){
          this.details.forEach(element => {
            this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
          });
        } else if (this.type == 'wash'){
          this.details.forEach(element => {
            this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']) );
          });
        }else if (this.type == 'payC' || this.type == 'return'){
          this.details.forEach(element => {
            this.totalAmount = this.totalAmount + parseInt(element['amount']);
          });
        }
        // this.totalAmount = Response[0].totalAmount
      } 
      // if(this.type == 'access' || this.type == 'lub'){
      // }
    },
    error=>{
      alert("error")
    });
  }
  togglePanel(index:number) {
    this.isOpened = index;
  }
}
