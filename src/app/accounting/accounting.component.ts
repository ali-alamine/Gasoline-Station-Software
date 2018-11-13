import { Component, OnInit } from '@angular/core';
import { AccountingService } from './accounting.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

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
  empIDForm = new FormControl();
  totalDrawer; empID;
  checked;

  constructor(private accountingServ:AccountingService,
    private router: Router, 
    private route: ActivatedRoute) { }
  tiles=[
    {text: 'counters', cols: 2, rows: 1},
    {text: 'lubricants', cols: 2, rows: 1},
    {text: 'carWashing', cols: 2, rows: 1},
    {text: 'accessories', cols: 2, rows: 1},
    {text: 'debits', cols: 2, rows: 1},
    {text: 'paymentsCost', cols: 2, rows: 1},
    {text: 'paymentsSupply', cols: 2, rows: 1},
    {text: 'sellAll', cols: 2, rows: 1},
    {text: 'return', cols: 2, rows: 1},
  ];
  ngOnInit() {
    this.empID=localStorage.getItem('userID');
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
    this.accountingServ.getTotalDarwer(this.empID).subscribe(Response => {
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
      this.checked = [this.empID];
    },
    error=>{
      alert("error")
    });
  }
  selectAccounting(accountingName,i){
    localStorage.setItem("empIDs",this.empIDForm.value);
    switch(accountingName) { 
      case "counters": { 
        console.log("counters")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'counters'} });
         break; 
      } 
      case "lubricants": { 
        console.log("lubricants")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'lub'} });
         break; 
      }
      case "carWashing": {
        console.log("carWashing")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'wash'} });
         break; 
      } 
      case "accessories": {
        console.log("accessories")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'access'} });
         break; 
      } 
      case "debits": {
        console.log("debits")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'debits'} });
         break; 
      }
      case "paymentsCost": {
        console.log("paymentsCost")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'payC'} });
         break; 
      }
      case "paymentsSupply": {
        console.log("paymentsSupply")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'supply'} });
         break; 
      }
      case "sellAll": {
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
  // selectEmp(event){
  //   console.log(this.empIDForm.value)
  //   if (event.source.selected) {
  //   }
  // }
  // getThisShiftSummary(){
   
  // }
  // getSoldLubricants(){
  //   this.accServ.getSoldLubricants().subscribe(
  //     Response=>{
  //       this.allLubInvoice=Response;
  //     },
  //     error=>{
  //       alert("error");
  //     });
  // }

}
