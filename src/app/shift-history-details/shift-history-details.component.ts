import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HistoryTypeComponent } from '../history-type/history-type.component';

@Component({
  selector: 'app-shift-history-details',
  templateUrl: './shift-history-details.component.html',
  styleUrls: ['./shift-history-details.component.scss']
})
export class ShiftHistoryDetailsComponent implements OnInit {
  private urlData;
  type;
  empID;
  totalAmount = 0;
  totalProfit = 0;
  details;
  isDebit;
  isOpened = 0;
  empType;
  selectedDetails = new Array();
  empIDs;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.urlData = this.route.queryParams.subscribe(params => {
      this.type = params['type'] || -1;
    });
    this.empID=localStorage.getItem('userID');
    this.empType=localStorage.getItem('activeUser');
    this.details = HistoryTypeComponent.details;
    console.log(this.details);
    this.getTypeDetails();
  }
  getTypeDetails(){
        // if(this.empType == 'admin'){
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
          }
          this.details.forEach(element => {
              this.selectedDetails.push(element);
          });
        // }
        // else{
        //   if(this.type == 'debits'){
        //     this.details.forEach(element => {
        //       if(element['shiftEmpID'] == this.empID)
        //         this.totalAmount = this.totalAmount + parseInt(element['rest']);
        //     });
        //   } else if (this.type == 'access' || this.type == 'lub' || this.type == 'supply' || this.type == 'wash'){
        //     this.details.forEach(element => {
        //       if(element['shiftEmpID'] == this.empID)
        //         this.totalProfit = this.totalProfit + parseInt(element['profit']);
        //         this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
        //     });
        //   } 
        //   else if (this.type == 'payC' || this.type == 'return'){
        //     this.details.forEach(element => {
        //       if(element['shiftEmpID'] == this.empID)
        //         this.totalAmount = this.totalAmount + parseInt(element['amount']);
        //     });
        //   }
        //   else if (this.type == 'allType'){
        //     this.details.forEach(element => {
        //       if(element['shiftEmpID'] == this.empID){
        //         if(element['type'] == 'access' || element['type'] == 'lub' || element['type'] == 'wash'){
        //           this.totalProfit = this.totalProfit + parseInt(element['profit']);
        //           this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
        //         }else if(element['type'] == 'return' || element['type'] == 'payC'){
        //           this.totalAmount = this.totalAmount + parseInt(element['amount']);
        //         }
        //       }
        //     });
        //   }
        //   this.details.forEach(element => {
        //     if(element['empType'] == 0)
        //       this.selectedDetails.push(element);
        //   });
        // }
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
