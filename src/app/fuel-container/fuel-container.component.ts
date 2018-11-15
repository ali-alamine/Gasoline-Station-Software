import { Component, OnInit } from '@angular/core';
import { FuelContainerService } from './fuel-container.service'; 
import { MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroup} from '@angular/forms';
import { MatSnackBar} from '@angular/material';
import { Observable } from 'rxjs';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-fuel-container',
  templateUrl: './fuel-container.component.html',
  styleUrls: ['./fuel-container.component.scss']
})

export class FuelContainerComponent implements OnInit {
  containers:any;
  modalReference: any;
  index:any;
  empID:any;
  cost_per_liter=0;
  totalPrice:any;
  totalLiters:any;
  suppliers:any;

  supplyForm = new FormGroup({
    quantityPerLiter: new FormControl(''),
    totalPrice: new FormControl(''),
    supplierID:new FormControl(''),
    containerID:new FormControl(''),
    empID:new FormControl(''),
    cost_liter:new FormControl(''),
  })
  isNaN: Function = Number.isNaN;
  constructor(private fuelContServ: FuelContainerService,private modalService: NgbModal,public snackBar: MatSnackBar) {}
  
  ngOnInit() {
    this.getContainers();
    this.empID=localStorage.getItem('userID');
    
  }
  reset(){
    this.supplyForm.reset();
  }
  isNumber(value) {
    return Number.isNaN(value);
  }
  getAllSuppliers(){
    this.fuelContServ.getAllSuppliers(0).subscribe( 
      Response=>{
        this.suppliers = Response;
      }
    )
  }
  getSelectedSupplierData(supplerID,containerID){
    this.supplyForm.get('supplierID').setValue(supplerID);
    this.supplyForm.get('containerID').setValue(containerID);
  }

  getContainers(){
      this.fuelContServ.getAllFuelContainers().subscribe( 
        Response=>{
          this.containers = Response;
          console.log( this.containers);
      }
    );
  }
  
  openContainerSupplyModal(countersModal,index) {
    this.index=index;
    this.getAllSuppliers();
    this.modalReference = this.modalService.open(countersModal, {
      centered: true,
      ariaLabelledBy: "modal-basic-title"
    });
  }
    /* show feed back message when sell succeed */
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 2000,
      });
    }
    submitSupply(){
      this.supplyForm.get('empID').setValue(this.empID);
      // this.supplyForm.get('cost_liter').setValue(this.cost_per_liter);
      console.log(this.supplyForm.value);
      this.fuelContServ.submitSupplyFuel(this.supplyForm.value).subscribe(
        Response=>{
          this.openSnackBar("submitted", "SUCCESS");
          this.supplyForm.reset();
          this.modalReference.close();
        }
      );
    }
}
