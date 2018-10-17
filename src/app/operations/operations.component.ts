import { Component, OnInit,OnDestroy  } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription } from 'rxjs';


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

  private urlData;
  private empName;
  constructor(private router: Router, private route: ActivatedRoute) {}

  adminTiles=[
    {text:"More Settings", cols: 2, rows: 1},
    {text:"Account", cols: 2, rows: 1}
  ]
  tiles=[
    {text: 'counters', cols: 2, rows: 1},
    {text: 'lubricants', cols: 2, rows: 1},
    {text: 'carWashing', cols: 2, rows: 1},
    {text: 'debits', cols: 2, rows: 1},
    {text: 'payments', cols: 2, rows: 1},
    {text: 'accessories', cols: 2, rows: 1},
    // {text: 'Seven', cols: 2, rows: 1},
    // {text: 'Eight', cols: 2, rows: 1}
  ];

  ngOnInit() {
    this.urlData = this.route.queryParams.subscribe(params => {
      this.empName = params['empName'] || -1;
  });
    this.userType=localStorage.getItem('activeUser');
    if(this.userType=='admin'){
      this.isAdmin=true;
    }else{
      this.isAdmin=false
    }
  }
  selectOperation(operationName,i){
    // alert(operationName)
    let selectedOperation = document.getElementsByClassName('tile-grid')[i+1];
    selectedOperation.classList.add('selectedTile');

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
      default: { 
         break; 
      } 
   }
   
  }
}
