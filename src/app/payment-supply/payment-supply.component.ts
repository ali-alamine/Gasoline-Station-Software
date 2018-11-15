import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
export interface Tile<tiles>{
  color: string;
  cols: number; 
  rows: number;
  text: string;
}
@Component({
  selector: 'app-payment-supply',
  templateUrl: './payment-supply.component.html',
  styleUrls: ['./payment-supply.component.scss']
})
export class PaymentSupplyComponent implements OnInit {
  userType:string;
  isAdmin:boolean;

  private urlData;
  constructor(private router: Router, private route: ActivatedRoute) { }
  tiles=[
    {text: 'counters', cols: 2, rows: 1},
    {text: 'lubricants', cols: 2, rows: 1},
    {text: 'accessories', cols: 2, rows: 1},
  ];
  ngOnInit() {
  }
  selectPaymentSupply(paymentName,i){
    // alert(paymentName)
    // let selectedPayment = document.getElementsByClassName('tile-grid')[i+1];
    // selectedPayment.classList.add('selectedTile');

    switch(paymentName) { 
      case "counters": { 
        this.router.navigate(["/fuelContainer"]);
         break; 
      } 
      case "lubricants": { 
        this.router.navigate(['/selllub'], { queryParams: { invoiceType:'supply'} });
         break; 
      }
      case "accessories": {
        this.router.navigate(['/sellAcc'], { queryParams: { invoiceType:'supply'} });
         break; 
      } 
      default: { 
         break; 
      } 
   }
   
  }

}
