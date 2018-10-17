import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Debits<debit>{
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-debits',
  templateUrl: './debits.component.html',
  styleUrls: ['./debits.component.scss']
})

export class DebitsComponent implements OnInit {

  constructor(
    // private modalService: NgbModal,
    private router: Router) { }

  ngOnInit() {
  }

  debit=[
    {text:"returns", cols: 2, rows: 1},
    {text:"debit_fuel", cols: 2, rows: 1},
    {text:"debit_washing", cols: 2, rows: 1},
    {text:"debit_lubricant", cols: 2, rows: 1},
    {text:"debit_accessories", cols: 2, rows: 1},
  ]

  openDebitModal(modalName,operationName,i){
    // alert(operationName)
    let selectedOperation = document.getElementsByClassName('tile-grid')[i];
    selectedOperation.classList.add('selectedTile');

    switch(operationName) { 
      case "returns": { 
        // this.router.navigate(["/counters"]);
         break; 
      } 
      case "debit_fuel": { 
        this.router.navigate(['/debbiting'], { queryParams: { debitType: "fuel"} });
         break; 
      }
      case "debit_washing": {
        this.router.navigate(['/debbiting'], { queryParams: { debitType: "washing"} });
         break; 
      }
      case "debit_lubricant": {
        this.router.navigate(['/selllub'], { queryParams: { debitType: "1"} });
         break; 
      } 
      case "accessories": {
        this.router.navigate(['/debbiting'], { queryParams: { debitType: "accessories"} });
         break; 
      } 
      case "debit_accessories": {
        this.router.navigate(['/debbiting'], { queryParams: { debitType: "accessories"} });
         break; 
      }
      default: { 
         break; 
      } 
   }
   
  //  this.modalReference = this.modalService.open(modalName, { centered: true, ariaLabelledBy: 'modal-basic-title' });
   
  }
}
