import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { PaymentsReportServicesService } from "./payments-report-services.service"
import { FormControl } from '@angular/forms';
import { formatDate } from "@angular/common";


@Component({
  selector: 'app-payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./payments-report.component.scss']
})

export class PaymentsReportComponent implements OnInit {
  filterForm;
  employees:any;
  reportResult:any;
  checked;
  private static fromDate;
  private static toDate;
  constructor(private fb: FormBuilder, private repServ: PaymentsReportServicesService) { }

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
      console.log(this.employees)
    },
    error=>{
      alert("error")
    });
  }

  getResult(){
    this.filterForm.value.fromDateCtrl = formatDate(this.filterForm.get("fromDateCtrl").value,"yyyy-MM-dd","en");
    this.filterForm.value.toDateCtrl = formatDate(this.filterForm.get("toDateCtrl").value,"yyyy-MM-dd","en");

    if(this.filterForm.value.selectedEmpId === undefined){
      this.filterForm.get('selectedEmpId').setValue(null)
    }

    this.repServ.getPaymentReportResult(this.filterForm.value).subscribe(Response=>{
      this.reportResult=Response;
      console.log(this.reportResult)
    },
    error=>{
      alert("error")
    });

  }

}
