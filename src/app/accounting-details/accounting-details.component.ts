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
  empID;
  totalAmount = 0;
  details;
  isDebit;
  isOpened = 0;
  empType;
  selectedDetails = new Array();
  constructor(private router: Router, private route: ActivatedRoute,private accountingServ:AccountingService,) { }

  ngOnInit() {
    this.urlData = this.route.queryParams.subscribe(params => {
      this.type = params['type'] || -1;
      // this.isDebit = params['isDebit'] || -1;
    });
    this.empID=localStorage.getItem('userID');
    this.empType=localStorage.getItem('activeUser');
    // if(this.userType=='admin'){
    // this.empIDs=localStorage.getItem('empIDs');
    console.log(this.empID)
    this.getTypeDetails();
    // console.log(AccountingComponent.empIDForm.value)
  }
  getTypeDetails(){
    let data={"type":this.type,"empID":this.empID};
    this.accountingServ.getTypeDetails(data).subscribe(Response=>{
      console.log(Response)
      if(Response!=0){
        // debugger
        this.details=Response;
        if(this.empType == 'admin'){
          if(this.type == 'debits'){
            this.details.forEach(element => {
              this.totalAmount = this.totalAmount + parseInt(element['rest']);
            });
          } else if (this.type == 'access' || this.type == 'lub' || this.type == 'supply' || this.type == 'wash'){
            this.details.forEach(element => {
              this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
            });
          } else if (this.type == 'payC' || this.type == 'return'){
            this.details.forEach(element => {
              this.totalAmount = this.totalAmount + parseInt(element['amount']);
            });
          }else if (this.type == 'allType'){
            this.details.forEach(element => {
              if(element['type'] == 'access' || element['type'] == 'lub' || element['type'] == 'wash'){
                this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
              }else if(element['type'] == 'return' || element['type'] == 'payC'){
                this.totalAmount = this.totalAmount + parseInt(element['amount']);
              }
            });
          }
          this.details.forEach(element => {
              this.selectedDetails.push(element);
          });
        }else{
          if(this.type == 'debits'){
            this.details.forEach(element => {
              if(element['shiftEmpID'] == this.empID)
                this.totalAmount = this.totalAmount + parseInt(element['rest']);
            });
          } else if (this.type == 'access' || this.type == 'lub' || this.type == 'supply' || this.type == 'wash'){
            this.details.forEach(element => {
              if(element['shiftEmpID'] == this.empID)
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
      } 
    },
    error=>{
      alert("error")
    });
  }
  togglePanel(index:number) {
    this.isOpened = index;
  }
}
