import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
export interface Tile<settOperations>{
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private router: Router) { }
  settOperations=[
    {text: 'stock', cols: 2, rows: 1},
    {text: 'Employees', cols: 2, rows: 1},
    {text: 'Clients', cols: 2, rows: 1},
    {text: 'setFuelPrice', cols: 2, rows: 1},
    {text: 'history', cols: 2, rows: 1},
    {text: 'Supplier', cols: 2, rows: 1},
  ];
  ngOnInit() {
  }
  selectOperation(operationName,i){
    alert(operationName)
    let selectedOperation = document.getElementsByClassName('tile-grid')[i-1];
    selectedOperation.classList.add('selectedTile');

    switch(operationName) { 
      case "stock": { 
        this.router.navigate(["/stock"]);
         break; 
      } 
      case "Employees": { 
        this.router.navigate(["/employee"]);
         break; 
      } 
      case "Clients": { 
        this.router.navigate(["/client"]);
         break; 
      } 
      case "Supplier": { 
        this.router.navigate(["/supplier"]);
         break; 
      }  
      case "history": { 
        this.router.navigate(["/history"]);
         break; 
      } 
      case "setFuelPrice": { 
        this.router.navigate(["/setFuelPrices"]);
         break; 
      } 
      default: { 
         break; 
      } 
    }
   
  }
}
