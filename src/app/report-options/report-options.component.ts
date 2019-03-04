import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
export interface Tile<tiles>{
  color: string;
  cols: number; 
  rows: number;
  text: string;
}
@Component({
  selector: 'app-report-options',
  templateUrl: './report-options.component.html',
  styleUrls: ['./report-options.component.scss']
})

export class ReportOptionsComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }
  tiles=[
    {text:"General Reports", cols: 2, rows: 1},
    {text:"payments", cols: 2, rows: 1},
  ];
  ngOnInit() {
    window.scroll(0, 0)
  }
  selectOperation(operationName,i){
    // alert(operationName)
    // let selectedOperation = document.getElementsByClassName('tile-grid')[i+1];
    // selectedOperation.classList.add('selectedTile');

    switch(operationName) { 
      case "General Reports": { 
        this.router.navigate(["/reports"]);
         break; 
      }
      case "payments": { 
        this.router.navigate(["/payments-report"]);
         break; 
      }
      default: { 
         break; 
      } 
   }
   
  }
 
}
