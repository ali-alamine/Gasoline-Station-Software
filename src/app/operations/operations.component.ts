import { Component, OnInit,OnDestroy  } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OperationsService } from './operations.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from '../app.component';
import { MessageServiceService } from '../message-service.service';

export interface Tile<tiles>{
  color: string;
  cols: number; 
  rows: number;
  text: string;
}
export interface AdminTile<adminTile>{
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})

export class OperationsComponent implements OnInit {
  userType:string;
  isAdmin:boolean;
  newShift:any;
  static staticTotalDrawer;
  totalDrawer;
  drawerDetail= [{initDrawer: "", drawerLub: "", drawerAccess: "", drawerWash: "", drawerReturn: '', drawerFuel:'',drawerFuelDebit:'',drawerPayC:''}];
  ;
  private urlData;
  private userName;
  shiftID;
  modalReference: any;
  constructor(private router: Router, private route: ActivatedRoute,
    private operationServ: OperationsService,private modalService: NgbModal,
    private ms:MessageServiceService) {}

  adminTiles=[
    {text:"More Settings", cols: 2, rows: 1},
    {text: 'report-options', cols: 2, rows: 1},
  ]
  tiles=[
    {text:"Account", cols: 2, rows: 1},
    {text: 'counters', cols: 2, rows: 1},
    {text: 'lubricants', cols: 2, rows: 1},
    {text: 'carWashing', cols: 2, rows: 1},
    {text: 'debits', cols: 2, rows: 1},
    {text: 'accessories', cols: 2, rows: 1},
    {text: 'paymentsCost', cols: 2, rows: 1},
    {text: 'paymentsSupply', cols: 2, rows: 1},
    {text: 'stock', cols: 2, rows: 1},
    {text: 'setFuelPrice', cols: 2, rows: 1}
  ];

  ngOnInit() {
    this.userType=localStorage.getItem('activeUser');
    this.shiftID=localStorage.getItem('shiftID');
    this.newShift=localStorage.getItem('newShift');
    this.userName=localStorage.getItem('userName');
    this.userType=localStorage.getItem('activeUser');
    if(this.userType=="admin"){
      this.isAdmin=true;
    }else{
      this.isAdmin=false;
    }
    this.ms.getTotalDarwer(this.shiftID).subscribe(Response => {
      // this.ms.changeTotal(Response[0].total);
      if(Response == null) this.totalDrawer = 0;
      else this.totalDrawer = Response[0].total;
    });
  }

  getDrawerDetail(){
    this.operationServ.getDrawerDetails(this.shiftID).subscribe(Response => {
      this.drawerDetail = Response;
      console.log("drawers")
      console.log(this.drawerDetail)
      console.log("drawers")
    },
    error=>{
      alert('Error Sum drawer!');
    }
  );

  }
  selectOperation(operationName,i){
    // alert(operationName)
    // let selectedOperation = document.getElementsByClassName('tile-grid')[i+1];
    // selectedOperation.classList.add('selectedTile');

    switch(operationName) { 
      case "stock": { 
        this.router.navigate(["/stock"]);
         break; 
      }
      case "counters": { 
        this.router.navigate(["/counters"]);
         break; 
      } 
      case "lubricants": { 
        this.router.navigate(["/selllub"]);
         break; 
      }
      case "carWashing": {
        this.router.navigate(["/wash"]);
         break; 
      } 
      case "debits": {
        this.router.navigate(["/debits"]);
         break; 
      } 
      case "More Settings": {
        this.router.navigate(["/settings"]);
         break; 
      } 
      case "setFuelPrice": { 
        this.router.navigate(["/setFuelPrices"]);
         break; 
      }
      case "accessories": {
        this.router.navigate(["/sellAcc"]);
         break; 
      } 
      case "Account": {
        this.router.navigate(["/account"]);
         break; 
      } 
      case "paymentsCost": {
        this.router.navigate(["/paymentCost"]);
         break; 
      }
      case "paymentsSupply": {
        this.router.navigate(["/paymentSupply"]);
         break; 
      }
      case "report-options": {
        this.router.navigate(["/report-options"]);
         break; 
      }
      default: { 
         break; 
      } 
   }
   
  }
}
