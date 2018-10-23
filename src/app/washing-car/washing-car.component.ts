import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { WashingCarService } from './washing-car.service';
import { MatSnackBar} from '@angular/material';

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
  constructor(public dialog: MatDialog, private washServ:WashingCarService,public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.empID=localStorage.getItem("userID")  /*Get Employee ID */
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
    let data={"machineName":name,"price":price,"empID":this.empID};
    this.washServ.sellWashService(data).subscribe(
    Response=>{
      this.openSnackBar(price + " Added to drawer", "success");
    },
    error=>{
      alert("error");
    });
  }

}
