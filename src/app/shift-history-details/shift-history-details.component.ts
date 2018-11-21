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
    // this.empID=localStorage.getItem('userID');
    // this.empType=localStorage.getItem('activeUser');
    this.details = HistoryTypeComponent.details;
    console.log(this.details);
    this.getTypeDetails();
  }
  getTypeDetails(){
    this.selectedDetails = [];
    this.totalAmount = 0;
    this.totalProfit = 0;
    if(this.type == 'debits'){
      this.details.forEach(element => {
        this.totalAmount = this.totalAmount + parseInt(element['rest']);
      });
    } else if (this.type == 'access' || this.type == 'lub' || this.type == 'supply' || this.type == 'wash' ){
      this.details.forEach(element => {
        this.totalProfit = this.totalProfit + parseInt(element['profit']);
        this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
      });
    } else if (this.type == 'payC' || this.type == 'return'){
      this.details.forEach(element => {
        this.totalAmount = this.totalAmount + parseInt(element['amount']);
      });
    
    } else if (this.type == 'allType'){
      this.details.forEach(element => {
        if(element['type'] == 'access' || element['type'] == 'lub' || element['type'] == 'wash' 
        || element['type'] == 'dieselG_d' || element['type'] == 'dieselR_d' || element['type'] == '95_d'|| element['type'] == '98_d' ){
          this.totalProfit = this.totalProfit + parseInt(element['profit']);
          this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
        }else if(element['type'] == 'return' || element['type'] == 'payC' || 
        element['type'] == 'Diesel G' || element['type'] == 'Diesel R' || element['type'] == '95'|| element['type'] == '98'){
          this.totalAmount = this.totalAmount + parseInt(element['amount']);
        }
      });
    } else if(this.type == 'counters'){
      this.details.forEach(element => {
        if(element['type'] == 'dieselG_d' || element['type'] == 'dieselR_d' || element['type'] == '95_d'|| element['type'] == '98_d' ){
          this.totalProfit = this.totalProfit + parseInt(element['profit']);
          this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
        }else if(element['type'] == 'Diesel G' || element['type'] == 'Diesel R' || element['type'] == '95'|| element['type'] == '98'){
          this.totalAmount = this.totalAmount + parseInt(element['amount']);
        }
      });
    }
    this.details.forEach(element => {
        this.selectedDetails.push(element);
    });
       
  }
  togglePanel(index:number) {
    // alert("45")
    this.isOpened = index;
  }
}
