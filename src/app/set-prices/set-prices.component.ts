import { Component, OnInit } from '@angular/core';
import { SetPricesService } from './set-prices.service';
import { FormControl, FormGroup} from '@angular/forms';
import swal from 'sweetalert'
@Component({
  selector: 'app-set-prices',
  templateUrl: './set-prices.component.html',
  styleUrls: ['./set-prices.component.scss']
})
export class SetPricesComponent implements OnInit {
  fuelPrices:any;
  setFuelPrices = new FormGroup({
    newCost_liter: new FormControl(''),
    newPrice_liter: new FormControl(''),
    fuelType: new FormControl(''),
  })
  constructor(private setPricesServ:SetPricesService) { }

  ngOnInit() {
    this.getFuelPrices();
  }

  getFuelPrices(){
    this.setPricesServ.getFuelPrices().subscribe(
      Response=>{
        this.fuelPrices=Response;
      },error=>{
        console.log("0")
      })
  }

  submitNewPrices(i,type){
    if(
      (this.setFuelPrices.value.newCost_liter <=0 || 
      this.setFuelPrices.value.newCost_liter == "" || 
      this.setFuelPrices.value.newCost_liter == undefined)
       ||
      (this.setFuelPrices.value.newPrice_liter <=0 || 
      this.setFuelPrices.value.newPrice_liter == "" || 
      this.setFuelPrices.value.newPrice_liter == undefined)
      ){
      swal("Invalid Price");
    }else{
      swal({
        title: "Confirmation - " + type,
        buttons: {
          continue: {
            text: "Confirm",
            value: "continue",
          },
          noAction: {
            text:"Cancel",
            value: "Cancel",
          },
        },
        text:"cost_liter: " + this.setFuelPrices.value.newCost_liter +" --- " + "price_liter: " + this.setFuelPrices.value.newPrice_liter,
      })
      .then((value) => {
        switch (value) {
          case "cancel":
            break;
          case "continue":
          this.setFuelPrices.get('fuelType').setValue(type);
          this.setPricesServ.setNewPrices(this.setFuelPrices.value).subscribe(
            Response=>{ this.getFuelPrices();
              this.setFuelPrices.reset();
              swal("Success")
            },
            error=>{swal("Please contact E-Safe Solutions")})
            break;
        }
      });

    }
  
  }
}
