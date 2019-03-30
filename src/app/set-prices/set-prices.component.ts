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
  isValidtile98:boolean=false;
  isValidtile95:boolean=false;
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
            error=>{swal("Please contact your software developer")})
            break;
        }
      });

    }
  
  }

  lockotherButtons(e,fuelType){

    if(e.type){
      if(fuelType=='95'){
        var formElement = <HTMLFormElement>document.getElementById('tile95');
        formElement.style.opacity='1';
        var formElement = <HTMLFormElement>document.getElementById('bttn95');
        formElement.disabled = false;

        var formElement = <HTMLFormElement>document.getElementById('tile98');
        formElement.style.opacity='0.5';
        var formElement = <HTMLFormElement>document.getElementById('tileDiesel G');
        formElement.style.opacity='0.5';
        // disable buttons
        var formElement = <HTMLFormElement>document.getElementById('bttn98');
        formElement.disabled = true;
        var formElement = <HTMLFormElement>document.getElementById('bttnDiesel G');
        formElement.disabled = true;

 
      }else if(fuelType=='98'){
        var formElement = <HTMLFormElement>document.getElementById('tile98');
        formElement.style.opacity='1';
        var formElement = <HTMLFormElement>document.getElementById('bttn98');
        formElement.disabled = false;



        var formElement = <HTMLFormElement>document.getElementById('tile95');
        formElement.style.opacity='0.5';
        var formElement = <HTMLFormElement>document.getElementById('tileDiesel G');
        formElement.style.opacity='0.5';

        // disable buttons
        var formElement = <HTMLFormElement>document.getElementById('bttn95');
        formElement.disabled = true;
        var formElement = <HTMLFormElement>document.getElementById('bttnDiesel G');
        formElement.disabled = true;
        
      }else if(fuelType=='Diesel G'){
        var formElement = <HTMLFormElement>document.getElementById('tileDiesel G');
        formElement.style.opacity='1';
        var formElement = <HTMLFormElement>document.getElementById('bttnDiesel G');
        formElement.disabled = false;



        var formElement = <HTMLFormElement>document.getElementById('tile95');
        formElement.style.opacity='0.5';
        var formElement = <HTMLFormElement>document.getElementById('tile98');
        formElement.style.opacity='0.5';

        // disable buttons
        var formElement = <HTMLFormElement>document.getElementById('bttn95');
        formElement.disabled = true;
        var formElement = <HTMLFormElement>document.getElementById('bttn98');
        formElement.disabled = true;
      }
    }
    
  }
}