import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { WashingCarService } from './washing-car.service';
import { MatSnackBar} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-washing-car',
  templateUrl: './washing-car.component.html',
  styleUrls: ['./washing-car.component.scss']
})

export class WashingCarComponent implements OnInit {
  shiftID:any;
  name: string;
  machines=[
    {"id":1,"name":"سيارة","imgSrc":"../assets/icons/washingIcons/car.png","imgSrc_d":"../assets/icons/washingIcons/car_d.png","price":6000},
    {"id":2,"name":"موتو","imgSrc":"../assets/icons/washingIcons/moto.png","imgSrc_d":"../assets/icons/washingIcons/moto_d.png","price":3000},
    {"id":2,"name":"جيب","imgSrc":"../assets/icons/washingIcons/bigCar.png","imgSrc_d":"../assets/icons/washingIcons/bigCar_d.png","price":7000},
    {"id":3,"name":"باصات","imgSrc":"../assets/icons/washingIcons/bus.png","imgSrc_d":"../assets/icons/washingIcons/bus_d.png","price":3000},
    {"id":3,"name":"فرش","imgSrc":"../assets/icons/washingIcons/interior.png","imgSrc_d":"../assets/icons/washingIcons/interior_d.png","price":55000}
  ]
  urlData:any;
  invoiceType;
  debit;
  static washForm: FormGroup;
 
  constructor(public dialog: MatDialog, private washServ:WashingCarService,public snackBar: MatSnackBar,
    private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder) {}

  ngOnInit() {
    this.urlData = this.route.queryParams.subscribe(params => {
      this.debit = params['debit'] || false;
    });
    this.shiftID=localStorage.getItem("shiftID")  /*Get shift ID */
    WashingCarComponent.washForm = this.fb.group({
      shiftID:this.shiftID,
      nameCar:'',
      quantity:1,
      totalPrice:'',
      type:'wash',
      invoiceType:'sell'
    });
  }
  incPrice(defaultPrice,index){
    window.event.stopPropagation();
    this.machines[index]['price'] +=1000;
  }
  decPrice(defaultPrice,index){
    window.event.stopPropagation();
    this.machines[index]['price'] -=1000;
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  sellWashService(price,name){
    WashingCarComponent.washForm.get('nameCar').setValue(name);
    WashingCarComponent.washForm.get('totalPrice').setValue(price);

    if(this.debit == 'true'){
      this.router.navigate(['/debbiting'],{queryParams:{pageType:'sellWash'}});
    }
    else{
      this.washServ.sellWashService(WashingCarComponent.washForm.value).subscribe(
      Response=>{
        this.openSnackBar(name, "تم البيع");
      this.openSnackBar(price + " يضاف إلى درج", "success");
        // this.getAccessories(this.itemPerPage,this.offset);
        WashingCarComponent.washForm.reset();
        WashingCarComponent.washForm.get('shiftID').setValue(this.shiftID);
        WashingCarComponent.washForm.get('type').setValue('wash');
        WashingCarComponent.washForm.get('invoiceType').setValue('sell');
        setTimeout(()=>this.router.navigate(['/operations']),1000);
  
      },
      error=>{
        alert("error");
      });
    }
  }

  get nameCar() {
    return WashingCarComponent.washForm.get('nameCar')
  }
  get price() {
    return WashingCarComponent.washForm.get('price')
  }
}
