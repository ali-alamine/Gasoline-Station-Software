import { Component, OnInit } from '@angular/core';
import { CountersService } from './counters.service'; 
import { MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroupDirective, NgForm, Validators,FormGroup} from '@angular/forms';
import { Observable } from 'rxjs';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import swal from 'sweetalert';

@Component({
  selector: 'app-counters',
  templateUrl: './counters.component.html',
  styleUrls: ['./counters.component.scss']
})


export class CountersComponent implements OnInit {
  counters:any;
  counterVal_1:any;
  counterVal_2:any;
  modalReference: any;
  counterType_1:any;
  counterType_2:any;
  index:any;
  empID:any;
  shiftID;

  counter_1_from = new FormGroup({
    counter_1: new FormControl(''),
    dispID:new FormControl(''),
    containerID:new FormControl(''),
    cost_liter:new FormControl(''),
    liters_sold:new FormControl(''),
    shiftID:new FormControl(''),
    fuel_type:new FormControl(''),
    price_liter:new FormControl(''),
    

  })
  counter_2_from = new FormGroup({
    counter_2: new FormControl(''),
    dispID:new FormControl(''),
    containerID:new FormControl(''),
    cost_liter:new FormControl(''),
    liters_sold:new FormControl(''),
    shiftID:new FormControl(''),
    fuel_type:new FormControl(''),
    price_liter:new FormControl(''),

  })
  countersForm = new FormGroup({
    counterForm_1: new FormControl(''),
    counterForm_2: new FormControl('')
  })

  constructor(private counterServ: CountersService,private modalService: NgbModal) {}

  ngOnInit() {
    this.getDispansersCounters();
    this.shiftID=localStorage.getItem('shiftID');
    this.empID=localStorage.getItem('userID');
    // this.openCountersModal('countersModal',2);
  }
  getDispansersCounters(){
      this.counterServ.getAllDispanesersCounters().subscribe( 
        Response=>{
          this.counters = Response;
          console.log('Response')
          console.log(Response)
      }
    );
  }
  openCountersModal(countersModal,index,dispID,outputContID_1,outputContID_2,counterType_1,counterType_2,cost_liter_1,cost_liter_2,price_liter_1,price_liter_2){
    this.counterType_1=counterType_1;
    this.counterType_2=counterType_2;
    this.index=index;

    this.counter_1_from.get('dispID').setValue(dispID);
    this.counter_2_from.get('dispID').setValue(dispID);
    
    this.counter_1_from.get('containerID').setValue(outputContID_1);
    this.counter_2_from.get('containerID').setValue(outputContID_2);

    this.counter_1_from.get('cost_liter').setValue(cost_liter_1);
    this.counter_2_from.get('cost_liter').setValue(cost_liter_2);

    this.counter_1_from.get('fuel_type').setValue(counterType_1);
    this.counter_2_from.get('fuel_type').setValue(counterType_2);

    this.counter_1_from.get('price_liter').setValue(price_liter_1);
    this.counter_2_from.get('price_liter').setValue(price_liter_2);

    this.modalReference = this.modalService.open(countersModal, {
      centered: true,
      ariaLabelledBy: "modal-basic-title"
    });
  }

  submitCounters(liter_sold_1,liter_sold_2){
    if(liter_sold_1>0 && liter_sold_2 >0){

      var text = document.createElement('div');

      text.innerHTML = "<span style='color:black;font-weight:bold'> counter " + this.counterType_1 + " at : " + "<span style='color:firebrick'>" + this.counter_1_from.value.counter_1 + "</span> - Sold Liters: " + "<span style='color:firebrick'>" + liter_sold_1 + " </span> <br><span style='color:firebrick'> ----------------------------------------------------------- </span> <br>" + "counter " + this.counterType_2 + " at : " + "<span style='color:firebrick'>" + this.counter_2_from.value.counter_2 + "</span> - Sold Liters: " + "<span style='color:firebrick'>" + liter_sold_2 + "</span></span>";

      swal({
        content:text,
        title: "Summary",
        className: "success",
        closeOnClickOutside: false,
        closeOnEsc: false,
        dangerMode: true,

        buttons: {
          submit: {
            text: "Continue",
            value: "submit",
          },
          noAction: {
            text:"Cancel",
            value: "Cancel",
          },
        },
      })
      .then((value) => {
        switch (value) {
          case "cancel":
            break;
          case "submit":
          this.counter_1_from.get('liters_sold').setValue(liter_sold_1);
          this.counter_2_from.get('liters_sold').setValue(liter_sold_2);
          this.counter_1_from.get('shiftID').setValue(this.shiftID);
          this.counter_2_from.get('shiftID').setValue(this.shiftID);
  
          this.countersForm.get('counterForm_1').setValue(this.counter_1_from.value);
          this.countersForm.get('counterForm_2').setValue(this.counter_2_from.value);
          console.log(this.countersForm.value);
          this.counterServ.submitCounters(this.countersForm.value).subscribe( 
            Response=>{
              this.getDispansersCounters();
              this.counter_1_from.reset();
              this.counter_2_from.reset();
              swal("Success", {
                // button: false,
                timer:500
              });
          },
          error=>{
            swal("please contact your software developer");
          }
        );

          
            break;
        }

      });
    }else{
      var message = document.createElement('h5');
      message.innerHTML="Please make sure the counters are correct";
      // swal({
      //   content:message,
      //   buttons:{
      //     ok:{
      //       text:"Ok",
      //       value:"ok"
      //     }
      //   }
      // });
    }
  }

  reset(){
    this.counter_1_from.reset();
    this.counter_2_from.reset();
  }

}
