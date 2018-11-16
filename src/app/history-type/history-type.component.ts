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
    // this.shiftData.shiftID.forEach(element => {
    //   const ID = this.fb.group({
    //     shiftID:element['shiftID'] 
    //   });
    //   this.shiftIDForm.push(ID);
    // });
  }
  selectAccounting(accountingName,i){
    HistoryTypeComponent.shiftDataForm.get('type').setValue(accountingName)
    this.historyServ.getShiftTypeDetails(HistoryTypeComponent.shiftDataForm.value).subscribe(Response=>{
      // console.log(Response)
      if(Response!=0){
        HistoryTypeComponent.details=Response;
        // console.log(ShiftHistoryComponent.details)
        switch(accountingName) { 
          case "counters": { 
            // console.log("counters")
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'counters'} });
             break; 
          } 
          case "lub": { 
            // console.log("lub")
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'lub'} });
             break; 
          }
          case "wash": {
            // console.log("wash")
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'wash'} });
             break; 
          } 
          case "access": {
            // console.log("access")
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'access'} });
             break; 
          } 
          case "debits": {
            // console.log("debits")
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'debits'} });
             break; 
          }
          case "payC": {
            // console.log("payC")
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'payC'} });
             break; 
          }
          case "supply": {
            // console.log("supply")
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'supply'} });
             break; 
          }
          case "allType": {
            // console.log("allType")
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'allType'} });
             break; 
          }  
          case "return": {
            // console.log("return")
            this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'return'} });
             break; 
          } 
          default: { 
             break; 
          } 
        }
      }
      else{
        alert("No Resulte")
      }
      
       
    //     // if(this.empType == 'admin'){
    //     //   if(this.type == 'debits'){
    //     //     this.details.forEach(element => {
    //     //       this.totalAmount = this.totalAmount + parseInt(element['rest']);
    //     //     });
    //     //   } else if (this.type == 'access' || this.type == 'lub' || this.type == 'supply' || this.type == 'wash'){
    //     //     this.details.forEach(element => {
    //     //       this.totalProfit = this.totalProfit + parseInt(element['profit']);
    //     //       this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
    //     //     });
    //     //   } else if (this.type == 'payC' || this.type == 'return'){
    //     //     this.details.forEach(element => {
    //     //       this.totalAmount = this.totalAmount + parseInt(element['amount']);
    //     //     });
    //     //   }else if (this.type == 'allType'){
    //     //     this.details.forEach(element => {
    //     //       if(element['type'] == 'access' || element['type'] == 'lub' || element['type'] == 'wash'){
    //     //         this.totalProfit = this.totalProfit + parseInt(element['profit']);
    //     //         this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
    //     //       }else if(element['type'] == 'return' || element['type'] == 'payC'){
    //     //         this.totalAmount = this.totalAmount + parseInt(element['amount']);
    //     //       }
    //     //     });
    //     //   }
    //     //   this.details.forEach(element => {
    //     //       this.selectedDetails.push(element);
    //     //   });
    //     // }else{
    //     //   if(this.type == 'debits'){
    //     //     this.details.forEach(element => {
    //     //       if(element['shiftEmpID'] == this.empID)
    //     //         this.totalAmount = this.totalAmount + parseInt(element['rest']);
    //     //     });
    //     //   } else if (this.type == 'access' || this.type == 'lub' || this.type == 'supply' || this.type == 'wash'){
    //     //     this.details.forEach(element => {
    //     //       if(element['shiftEmpID'] == this.empID)
    //     //         this.totalProfit = this.totalProfit + parseInt(element['profit']);
    //     //         this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
    //     //     });
    //     //   } 
    //     //   else if (this.type == 'payC' || this.type == 'return'){
    //     //     this.details.forEach(element => {
    //     //       if(element['shiftEmpID'] == this.empID)
    //     //         this.totalAmount = this.totalAmount + parseInt(element['amount']);
    //     //     });
    //     //   }
    //     //   else if (this.type == 'allType'){
    //     //     this.details.forEach(element => {
    //     //       if(element['shiftEmpID'] == this.empID){
    //     //         if(element['type'] == 'access' || element['type'] == 'lub' || element['type'] == 'wash'){
    //     //           this.totalProfit = this.totalProfit + parseInt(element['profit']);
    //     //           this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
    //     //         }else if(element['type'] == 'return' || element['type'] == 'payC'){
    //     //           this.totalAmount = this.totalAmount + parseInt(element['amount']);
    //     //         }
    //     //       }
    //     //     });
    //     //   }
    //     //   this.details.forEach(element => {
    //     //     if(element['empType'] == 0)
    //     //       this.selectedDetails.push(element);
    //     //   });
    //     // }
    //   } 
    },
    error=>{
      alert("error")
    });
    // localStorage.setItem("empIDs",this.empIDForm.value);
    
  }
  get type() {
    return HistoryTypeComponent.shiftDataForm.get('type')
  }
  // get shiftIDForm() {
  //   return HistoryTypeComponent.shiftDataForm.get('shiftID') as FormArray
  // }
}