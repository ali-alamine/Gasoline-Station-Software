import { Component, OnInit } from '@angular/core';
import { AccountingService } from './accounting.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { OperationsService } from '../operations/operations.service';

export interface Tile<tiles>{
  color: string;
  cols: number; 
  rows: number;
  text: string;
}
// export interface AdminTile<adminTile>{
//   color: string;
//   cols: number;
//   rows: number;
//   text: string;
// }

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements OnInit {
  allLubInvoice:any;
  userType:string;
  isAdmin:boolean;
  private urlData;
  employees:any;
  shiftIDForm = new FormControl();
  totalDrawer; shiftID; empID;
  checked;
  static details;

  constructor(private accountingServ:AccountingService,
    private router: Router, 
    private route: ActivatedRoute,private operationServ: OperationsService) { }
    tiles=[
      {text: 'counters', cols: 2, rows: 1},
      {text: 'lub', cols: 2, rows: 1},
      {text: 'wash', cols: 2, rows: 1},
      {text: 'access', cols: 2, rows: 1},
      {text: 'debits', cols: 2, rows: 1},
      {text: 'payC', cols: 2, rows: 1},
      {text: 'supply', cols: 2, rows: 1},
      {text: 'allType', cols: 2, rows: 1},
      {text: 'return', cols: 2, rows: 1},
    ];
  ngOnInit() {
    this.shiftID=localStorage.getItem('shiftID');
    this.empID=localStorage.getItem('empID');
    this.userType=localStorage.getItem('activeUser');
    if(this.userType=='admin'){
      this.isAdmin=true;
      this.getEmployees();
    }else{
      this.isAdmin=false
    }
    this.getTotalDarwer();
  }
  getTotalDarwer(){
    this.operationServ.getTotalDarwer(this.shiftID).subscribe(Response => {
      if(Response == null) this.totalDrawer = 0;
      else this.totalDrawer = Response[0].total;
      },
      error=>{
        alert('Error Sum drawer!')
      }
    );
  }
  getEmployees(){
    this.accountingServ.getTodayEmp().subscribe(Response=>{
      this.employees=Response;
      this.checked = [this.shiftID];
    },
    error=>{
      alert("error")
    });
  }
  selectAccounting(accountingName,i){
    localStorage.setItem("shiftIDs",this.shiftIDForm.value);
    console.log(this.shiftIDForm.value)
    let data={"type":accountingName,"shiftIDs":this.shiftIDForm.value};
    this.accountingServ.getDetailInvoice(data).subscribe(Response=>{
      if(Response!=0){
        AccountingComponent.details=Response;
        switch(accountingName) { 
          case "counters": { 
            console.log("counters")
            this.router.navigate(['/accountDetails'], { queryParams: { type:'counters'} });
             break; 
          } 
          case "lub": { 
            console.log("lub")
            this.router.navigate(['/accountDetails'], { queryParams: { type:'lub'} });
             break; 
          }
          case "wash": {
            console.log("wash")
            this.router.navigate(['/accountDetails'], { queryParams: { type:'wash'} });
             break; 
          } 
          case "access": {
            console.log("accessories")
            this.router.navigate(['/accountDetails'], { queryParams: { type:'access'} });
             break; 
          } 
          case "debits": {
            console.log("debits")
            this.router.navigate(['/accountDetails'], { queryParams: { type:'debits'} });
             break; 
          }
          case "payC": {
            console.log("paymentsCost")
            this.router.navigate(['/accountDetails'], { queryParams: { type:'payC'} });
             break; 
          }
          case "supply": {
            console.log("paymentsSupply")
            this.router.navigate(['/accountDetails'], { queryParams: { type:'supply'} });
             break; 
          }
          case "allType": {
            console.log("sellAll")
            this.router.navigate(['/accountDetails'], { queryParams: { type:'allType'} });
             break; 
          }  
          case "return": {
            console.log("return")
            this.router.navigate(['/accountDetails'], { queryParams: { type:'return'} });
             break; 
          } 
          default: { 
             break; 
          } 
       }
      }
      else{
        alert("No Resulte")
      }
      },
      error=>{
        alert("error")
      });
    
   
  }
}
