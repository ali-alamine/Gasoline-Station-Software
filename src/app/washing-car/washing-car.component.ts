import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { WashingCarService } from './washing-car.service';
import { MatSnackBar} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'app-washing-car',
  templateUrl: './washing-car.component.html',
  styleUrls: ['./washing-car.component.scss']
})

export class WashingCarComponent implements OnInit {
  empID:any;
  name: string;
  machines=[
    {"id":1,"name":"Car","imgSrc":"../assets/icons/washingIcons/car.png","price":6000},
    {"id":2,"name":"Moto","imgSrc":"../assets/icons/washingIcons/moto.png","price":3000},
    {"id":2,"name":"Big Car","imgSrc":"../assets/icons/washingIcons/bigCar.png","price":7000},
    {"id":3,"name":"Bus","imgSrc":"../assets/icons/washingIcons/bus.png","price":3000},
    {"id":3,"name":"Interior","imgSrc":"../assets/icons/washingIcons/interior.png","price":55000}
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
    this.empID=localStorage.getItem("userID")  /*Get Employee ID */
    WashingCarComponent.washForm = this.fb.group({
      empID:this.empID,
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
      // let sellWashingData={
      //   "itemID":2,
      //   "empID":this.empID,
      //   "nameCar":name,
      //   "price":price,
      //   "totalProfit":price,
      //   "quantity":1,
      //   "totalPrice":price,
      //   "type":'wash',
      //   'invoiceType':'sell'
      // };
      this.router.navigate(['/debbiting'],{queryParams:{pageType:'sellWash'}});
    }
    else{
      // let sellWashingData={
      //   "itemID":2,
      //   "empID":this.empID,
      //   "nameCar":name,
      //   "price":price,
      //   "totalProfit":price,
      //   "quantity":1,
      //   "totalPrice":price,
      //   "type":'wash',
      //   'invoiceType':'sell'
      // };
      this.washServ.sellWashService(WashingCarComponent.washForm.value).subscribe(
      Response=>{
        this.openSnackBar(name, "SOLD");
      this.openSnackBar(price + " Added to drawer", "success");
        // this.getAccessories(this.itemPerPage,this.offset);
  
      },
      error=>{
        alert("error");
      });
    }

    
    // let data={"machineName":name,"price":price,"empID":this.empID};
    // this.washServ.sellWashService(data).subscribe(
    // Response=>{
    //   this.openSnackBar(price + " Added to drawer", "success");
    // },
    // error=>{
    //   alert("error");
    // });
  }

  get nameCar() {
    return WashingCarComponent.washForm.get('nameCar')
  }
  get price() {
    return WashingCarComponent.washForm.get('price')
  }
}
