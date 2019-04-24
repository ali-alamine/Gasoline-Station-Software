import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ReportServicesService } from "./report-services.service"
import { FormControl } from '@angular/forms';
import { formatDate } from "@angular/common";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import swal from 'sweetalert';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  filterForm;
  employees:any;
  reportResult:any;
  checked;
  private static fromDate;
  private static toDate;
  // selectedEmpId = new FormControl();
  @BlockUI('blockUI') blockUI: NgBlockUI;
  constructor(private fb: FormBuilder, private repServ: ReportServicesService) { }

  ngOnInit() {
    this.getEmployees();
    this.filterForm = this.fb.group({
      fromDateCtrl: '',
      toDateCtrl: '',
      selectedEmpId:[],
      expenses: [true],
      sell: [true],
      debits: [true]
    });
  }

  getEmployees(){
    this.repServ.getAllEmployees().subscribe(Response=>{
      this.employees=Response;
    },
    error=>{
      swal("please contact your software developer")
    });
  }

  getResult(){
  
    // this.blockUI.start("loading")
    if(this.filterForm.value.fromDateCtrl && this.filterForm.value.toDateCtrl){
      var formElement = <HTMLFormElement>document.getElementById('container');
      formElement.style.opacity='0.01';


    this.filterForm.value.fromDateCtrl = formatDate(this.filterForm.get("fromDateCtrl").value,"yyyy-MM-dd","en");
    this.filterForm.value.toDateCtrl = formatDate(this.filterForm.get("toDateCtrl").value,"yyyy-MM-dd","en");

    if(this.filterForm.value.selectedEmpId === undefined){
      this.filterForm.get('selectedEmpId').setValue(null)
    }

    this.repServ.getReportResult(this.filterForm.value).subscribe(response=>{
      debugger
      // this.blockUI.stop();
      var formElement = <HTMLFormElement>document.getElementById('container');
      formElement.style.opacity='1';
      this.reportResult=response;
      console.log(this.reportResult)
    },
    error=>{
      var formElement = <HTMLFormElement>document.getElementById('container');
      formElement.style.opacity='1';
      swal("please contact your softwar developer");
    });

  }else{
    swal("التاريخ غير محدد");
  }

  }

  getSelectedRow(name){
    alert(name)
  }
}
