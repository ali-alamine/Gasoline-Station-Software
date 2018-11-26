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
    this.historyServ.getShiftDetails(this.filterForm.value).subscribe(Response=>{
      if(Response[1][0]['total'] != 0){
        this.shiftDetails=Response[0];
        this.totalItems=Response[1][0]['total'];
      }else{
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
  getDetail(id){
    HistoryComponent.shiftForm.get('shiftID').setValue(id)
    this.router.navigate(['/historyType']);
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
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
}