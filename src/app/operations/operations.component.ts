import { Component, OnInit,OnDestroy  } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OperationsService } from './operations.service';


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
  newShift;
  totalDrawer;
  private urlData;
  private userName;
  empID;
  constructor(private router: Router, private route: ActivatedRoute,private operationServ: OperationsService) {}

  adminTiles=[
    {text:"More Settings", cols: 2, rows: 1},
    {text:"Account", cols: 2, rows: 1}
  ]
  tiles=[
    {text: 'counters', cols: 2, rows: 1},
    {text: 'lubricants', cols: 2, rows: 1},
    {text: 'carWashing', cols: 2, rows: 1},
    {text: 'debits', cols: 2, rows: 1},
    {text: 'accessories', cols: 2, rows: 1},
    {text: 'paymentsCost', cols: 2, rows: 1},
    {text: 'paymentsSupply', cols: 2, rows: 1},
    // {text: 'Seven', cols: 2, rows: 1},
    // {text: 'Eight', cols: 2, rows: 1}
  ];

  ngOnInit() {
    // this.urlData = this.route.queryParams.subscribe(params => {
    //   this.userName = params['userName'] || -1;
    // });
    this.userType=localStorage.getItem('activeUser');
    this.empID=localStorage.getItem('userID');
    this.newShift=localStorage.getItem('newShift');
    this.userName=localStorage.getItem('userName');
    if(this.userType=='admin'){
      this.isAdmin=true;
      // this.newShift=true;
    }else{
      this.isAdmin=false
    }
    this.getTotalDarwer();
  }
  getTotalDarwer(){
    this.operationServ.getTotalDarwer(this.empID).subscribe(Response => {
      console.log(Response)
      this.totalDrawer = Response[0].total;
    },
    error=>{
      alert('Error Sum drawer!')
    }
  );

  }
  selectOperation(operationName,i){
    // alert(operationName)
    // let selectedOperation = document.getElementsByClassName('tile-grid')[i+1];
    // selectedOperation.classList.add('selectedTile');

    switch(operationName) { 
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
      default: { 
         break; 
      } 
   }
   
  }
}
