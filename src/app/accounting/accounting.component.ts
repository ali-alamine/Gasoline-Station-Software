import { Component, OnInit } from '@angular/core';
import { AccountingService } from './accounting.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  // private empName;

  constructor(private accServ:AccountingService,private router: Router, private route: ActivatedRoute) { }
  tiles=[
    {text: 'counters', cols: 2, rows: 1},
    {text: 'lubricants', cols: 2, rows: 1},
    {text: 'carWashing', cols: 2, rows: 1},
    {text: 'accessories', cols: 2, rows: 1},
    {text: 'debits', cols: 2, rows: 1},
    {text: 'paymentsCost', cols: 2, rows: 1},
    {text: 'paymentsSupply', cols: 2, rows: 1},
    {text: 'sellAll', cols: 2, rows: 1},
    // {text: 'Seven', cols: 2, rows: 1},
    // {text: 'Eight', cols: 2, rows: 1}
  ];
  ngOnInit() {
    // this.urlData = this.route.queryParams.subscribe(params => {
    //   this.empName = params['empName'] || -1;
    // });
    this.userType=localStorage.getItem('activeUser');
    if(this.userType=='admin'){
      this.isAdmin=true;
    }else{
      this.isAdmin=false
    }
  }
  selectAccounting(accountingName,i){
    let selectedAccounting = document.getElementsByClassName('tile-grid')[i+1];
    selectedAccounting.classList.add('selectedTile');

    switch(accountingName) { 
      case "counters": { 
        console.log("counters")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'counters'} });
         break; 
      } 
      case "lubricants": { 
        console.log("lubricants")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'lubricants'} });
         break; 
      }
      case "carWashing": {
        console.log("carWashing")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'accountDetails'} });
         break; 
      } 
      case "accessories": {
        console.log("accessories")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'accessories'} });
         break; 
      } 
      case "debits": {
        console.log("debits")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'debits'} });
         break; 
      }
      case "paymentsCost": {
        console.log("paymentsCost")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'paymentsCost'} });
         break; 
      }
      case "paymentsSupply": {
        console.log("paymentsSupply")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'paymentsSupply'} });
         break; 
      }
      case "sellAll": {
        console.log("sellAll")
        this.router.navigate(['/accountDetails'], { queryParams: { type:'sellAll'} });
         break; 
      }  
      default: { 
         break; 
      } 
   }
   
  }
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
