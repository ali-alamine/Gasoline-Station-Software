import { Component, OnInit } from '@angular/core';
import { HistoryComponent } from '../history/history.component';
import { FormGroup, FormBuilder, FormControl, FormArray } from '../../../node_modules/@angular/forms';
import { Router } from '../../../node_modules/@angular/router';
import { HistoryService } from '../history/history.service';

export interface Tile<tiles>{
  color: string;
  cols: number; 
  rows: number;
  text: string;
}
@Component({
  selector: 'app-history-type',
  templateUrl: './history-type.component.html',
  styleUrls: ['./history-type.component.scss']
})
export class HistoryTypeComponent implements OnInit {
  static shiftDataForm: FormGroup;
  shiftData :any;
  static details;

  constructor(private fb: FormBuilder,private router: Router,private historyServ: HistoryService) { }
  tiles=[
    {text: 'counters', cols: 2, rows: 1},
    {text: 'lub', cols: 2, rows: 1},
    {text: 'wash', cols: 2, rows: 1},
    {text: 'access', cols: 2, rows: 1},
    {text: 'debits', cols: 2, rows: 1},
    {text: 'payC', cols: 2, rows: 1},
    {text: 'supply', cols: 2, rows: 1},
    {text: 'allType', cols: 2, rows: 1},
    {text: 'return', cols: 2, rows: 1},
  ];
  ngOnInit() {
    this.shiftData = HistoryComponent.shiftForm.value;
    HistoryTypeComponent.shiftDataForm = this.fb.group({
      type: '',
      shiftID: HistoryComponent.shiftForm.value.shiftID
    })
    console.log(HistoryTypeComponent.shiftDataForm)
  }
  selectAccounting(accountingName,i){
    HistoryTypeComponent.shiftDataForm.get('type').setValue(accountingName)
    this.historyServ.getShiftTypeDetails(HistoryTypeComponent.shiftDataForm.value).subscribe(Response=>{
      if(Response!=0){
        HistoryTypeComponent.details=Response;
        switch(accountingName) { 
          case "counters": { 
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'counters'} });
             break; 
          } 
          case "lub": {
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'lub'} });
             break; 
          }
          case "wash": {
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'wash'} });
             break; 
          } 
          case "access": {
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'access'} });
             break; 
          } 
          case "debits": {
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'debits'} });
             break; 
          }
          case "payC": {
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'payC'} });
             break; 
          }
          case "supply": {
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'supply'} });
             break; 
          }
          case "allType": {
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'allType'} });
             break; 
          }  
          case "return": {
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'return'} });
             break; 
          } 
          default: { 
             break; 
          } 
        }
      }
      else{
        swal({
          type: 'error',
          title: 'تنبية',
          text:'لا يوجد نتيجة',
          showConfirmButton: false,
          timer: 2000
        });
      }
    },
    error=>{
      alert("error")
    });    
  }
  get type() {
    return HistoryTypeComponent.shiftDataForm.get('type')
  }
}