import { Component, OnInit } from '@angular/core';
import { SetPricesService } from './set-prices.service';
@Component({
  selector: 'app-set-prices',
  templateUrl: './set-prices.component.html',
  styleUrls: ['./set-prices.component.scss']
})
export class SetPricesComponent implements OnInit {

  fuelPrices:any;
  newCost_liter:any;
  newPrice_liter:any;
  constructor(private setPricesServ:SetPricesService) { }

  ngOnInit() {
    this.getFuelPrices()
  }

  getFuelPrices(){
    this.setPricesServ.getFuelPrices().subscribe(
      Response=>{
        this.fuelPrices=Response;
      },error=>{
        console.log("0")
      })
  }

  selectFuelType(cost_liter,price_liter){
    alert(cost_liter + " -- " + price_liter)
  }
}
