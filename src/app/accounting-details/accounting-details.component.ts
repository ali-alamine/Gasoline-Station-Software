import { Component, OnInit } from '@angular/core';
import { AccountingComponent } from '../accounting/accounting.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountingService } from '../accounting/accounting.service';

@Component({
  selector: 'app-accounting-details',
  templateUrl: './accounting-details.component.html',
  styleUrls: ['./accounting-details.component.scss']
})
export class AccountingDetailsComponent implements OnInit {
  private urlData;
  type;
  empID;shiftID;
  totalAmount = 0;
  totalProfit = 0;
  details;
  isDebit;
  isOpened = 0;
  empType;
  selectedDetails = new Array();
  shiftIDs;
  constructor(private router: Router, private route: ActivatedRoute,private accountingServ:AccountingService) { }

  ngOnInit() {
    // console.log(ShiftHistoryComponent.filterForm.value)
    this.urlData = this.route.queryParams.subscribe(params => {
      this.type = params['type'] || -1;
    });
    this.empID=localStorage.getItem('userID');
    this.shiftID=localStorage.getItem('shiftID');
    // alert(this.type)
    this.empType=localStorage.getItem('activeUser');
    this.shiftIDs=localStorage.getItem('shiftIDs');
    this.getDetailInvoice();
    this.shiftIDs=this.shiftIDs.split(',');
    // console.log(this.shiftIDs);
    // this.getDetailInvoice();
  }
  getDetailInvoice(){
    // let data={"type":this.type,"shiftIDs":this.shiftIDs};
    // this.accountingServ.getDetailInvoice(data).subscribe(Response=>{
    //   if(Response!=0){
        this.details=AccountingComponent.details;
        this.totalProfit= 0;
        this.totalAmount= 0;
        this.selectedDetails= [];
        // console.log(this.details)
        if(this.empType == 'admin'){
          if(this.type == 'debits'){
            this.details.forEach(element => {
              this.totalAmount = this.totalAmount + parseInt(element['rest']);
            });
          } else if (this.type == 'access' || this.type == 'lub' || this.type == 'supply' || this.type == 'wash'){
            this.details.forEach(element => {
              this.totalProfit = this.totalProfit + parseInt(element['profit']);
              this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
            });
          } else if (this.type == 'payC' || this.type == 'return'){
            this.details.forEach(element => {
              this.totalAmount = this.totalAmount + parseInt(element['amount']);
            });
          }else if (this.type == 'allType'){
            this.details.forEach(element => {
              if(element['type'] == 'access' || element['type'] == 'lub' || element['type'] == 'wash'){
                this.totalProfit = this.totalProfit + parseInt(element['profit']);
                this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
              }else if(element['type'] == 'return' || element['type'] == 'payC'){
                this.totalAmount = this.totalAmount + parseInt(element['amount']);
              }
            });
          }else if(this.type == 'counters'){
            this.details.forEach(element => {
              if(element['type'] == 'deiselG_d' || element['type'] == 'deiselR_d' || element['type'] == '95_d'|| element['type'] == '98_d' ){
                this.totalProfit = this.totalProfit + parseInt(element['profit']);
                this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
              }else if(element['type'] == 'Deisel G' || element['type'] == 'Deisel R' || element['type'] == '95'|| element['type'] == '98'){
                this.totalAmount = this.totalAmount + parseInt(element['amount']);
              }
            });
          }
          this.details.forEach(element => {
              this.selectedDetails.push(element);
          });
        // console.log(this.selectedDetails)

        }
        else{
          if(this.type == 'debits'){
            this.details.forEach(element => {
              if(element['shiftEmpID'] == this.empID)
                this.totalAmount = this.totalAmount + parseInt(element['rest']);
            });
          } else if (this.type == 'access' || this.type == 'lub' || this.type == 'supply' || this.type == 'wash'){
            this.details.forEach(element => {
              if(element['shiftEmpID'] == this.empID)
                this.totalProfit = this.totalProfit + parseInt(element['profit']);
                this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
            });
          } 
          else if (this.type == 'payC' || this.type == 'return'){
            this.details.forEach(element => {
              if(element['shiftEmpID'] == this.empID)
                this.totalAmount = this.totalAmount + parseInt(element['amount']);
            });
          }
          else if (this.type == 'allType'){
            this.details.forEach(element => {
              if(element['shiftEmpID'] == this.empID){
                if(element['type'] == 'access' || element['type'] == 'lub' || element['type'] == 'wash'){
                  this.totalProfit = this.totalProfit + parseInt(element['profit']);
                  this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
                }else if(element['type'] == 'return' || element['type'] == 'payC'){
                  this.totalAmount = this.totalAmount + parseInt(element['amount']);
                }
              }
            });
          }
          this.details.forEach(element => {
            if(element['empType'] == 0)
              this.selectedDetails.push(element);
          });
        }
      // } 
    // },
    // error=>{
    //   alert("error")
    // });
  }
  togglePanel(index:number) {
    this.isOpened = index;
  }
}
