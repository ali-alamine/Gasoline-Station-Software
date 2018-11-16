import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { HistoryService } from './history.service';
import { MatSnackBar } from '../../../node_modules/@angular/material';

export interface Tile<tiles>{
  color: string;
  cols: number; 
  rows: number;
  text: string;
}
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  allLubInvoice:any;
  userType:string;
  isAdmin:boolean;
  private urlData;
  employees:any;
  
  totalDrawer; empID;
  checked;
  filterForm: FormGroup;
  // empIDForm;
  shiftDetails='';

  private static fromExpDate;
  private static toExpDate;
  itemPerPage:any=12;
  offset=0;
  totalItems=0;
  pageBtns:any;
  static shiftForm: FormGroup;

  constructor(private historyServ:HistoryService,
    private router: Router, 
    private route: ActivatedRoute,private fb: FormBuilder,public snackBar: MatSnackBar,) { }
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
    this.empID=localStorage.getItem('userID');
      const currentDate = new Date();
      HistoryComponent.fromExpDate = currentDate.toISOString().substring(0, 10);
      HistoryComponent.toExpDate = currentDate.toISOString().substring(0, 10);
      this.filterForm = this.fb.group({
        fromExpDate:[HistoryComponent.fromExpDate, Validators.required],
        toExpDate:[HistoryComponent.toExpDate, Validators.required],
        empIDs: [new FormControl() , Validators.required],
      });
      HistoryComponent.shiftForm = this.fb.group({
        // fromExpDate: [HistoryComponent.fromExpDate, Validators.required],
        // toExpDate : [HistoryComponent.toExpDate, Validators.required],
        shiftID: ''
      });
      this.getEmployees();
  }
  getEmployees(){
    this.historyServ.getAllEmp().subscribe(Response=>{
      this.employees=Response;
      this.checked = [this.empID];
    },
    error=>{
      alert("error")
    });
  }
  
  getShiftDetails(){
    HistoryComponent.fromExpDate=formatDate(this.filterForm.get('fromExpDate').value,'yyyy-MM-dd','en');
    HistoryComponent.toExpDate=formatDate(this.filterForm.get('toExpDate').value,'yyyy-MM-dd','en');
    this.filterForm.get('fromExpDate').setValue(HistoryComponent.fromExpDate);
    this.filterForm.get('toExpDate').setValue(HistoryComponent.toExpDate);
    // HistoryComponent.shiftForm.get('fromExpDate').setValue(HistoryComponent.fromExpDate);
    // HistoryComponent.shiftForm.get('toExpDate').setValue(HistoryComponent.toExpDate);
    // console.log(this.filterForm.value)
    this.historyServ.getShiftDetails(this.filterForm.value).subscribe(Response=>{
      this.shiftDetails=Response[0];
      this.totalItems=Response[1][0]['total'];
    },
    error=>{
      alert("error")
    });
  }
  getDetail(id){
    // const ids = this.fb.group({
    //   shiftID:id  
    // });
    // this.shiftIDForm.push(ids);
    HistoryComponent.shiftForm.get('shiftID').setValue(id)
    this.router.navigate(['/historyType']);
    // this.openSnackBar("Shift "+i, "Add Detail");
  }
  // getDetail(){
  //   if(this.shiftIDForm.value != '')
  // }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  selectAccounting(accountingName,i){
    // this.filterForm.get('type').setValue(accountingName);
    // // let data={"type":accountingName,"empID":this.empIDs};
    // this.historyServ.getShiftDetails(this.filterForm.value).subscribe(Response=>{
    //   if(Response!=0){
    //     HistoryComponent.shiftdetails=Response;
    //     switch(accountingName) { 
    //       case "counters": { 
    //         this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'counters'} });
    //          break; 
    //       } 
    //       case "lub": { 
    //         this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'lub'} });
    //          break; 
    //       }
    //       case "wash": {
    //         this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'wash'} });
    //          break; 
    //       } 
    //       case "access": {
    //         this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'access'} });
    //          break; 
    //       } 
    //       case "debits": {
    //         this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'debits'} });
    //          break; 
    //       }
    //       case "payC": {
    //         this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'payC'} });
    //          break; 
    //       }
    //       case "supply": {
    //         this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'supply'} });
    //          break; 
    //       }
    //       case "allType": {
    //         this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'allType'} });
    //          break; 
    //       }  
    //       case "return": {
    //         this.router.navigate(['/shiftHistoryDetails'], { queryParams: { type:'return'} });
    //          break; 
    //       } 
    //       default: { 
    //          break; 
    //       } 
    //     }
       
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
    // },
    // error=>{
    //   alert("error")
    // });
    // // localStorage.setItem("empIDs",this.empIDForm.value);
    
  }
  
  get type() {
    return this.filterForm.get('type')
  }
  
  get fromExpDate() {
    return this.filterForm.get('fromExpDate')
  }
  get toExpDate() {
    return this.filterForm.get('toExpDate')
  }
  get shiftID() {
    return HistoryComponent.shiftForm.get('shiftID')
  }
  // get fromExpDate1() {
  //   return HistoryComponent.shiftForm.get('fromExpDate')
  // }
  // get toExpDate1() {
  //   return HistoryComponent.shiftForm.get('toExpDate')
  // }
}