import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ReportServicesService } from "./report-services.service"
import { FormControl } from '@angular/forms';
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
  // selectedEmpId = new FormControl();
  constructor(private fb: FormBuilder, private repServ: ReportServicesService) { }

  ngOnInit() {
    this.getEmployees();
    this.filterForm = this.fb.group({
      fromDateCtrl: [],
      toDateCtrl: [],
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
    // console.log(this.filterForm.value)

    this.repServ.getReportResult(this.filterForm.value).subscribe(Response=>{
      this.reportResult=Response;
      console.log(this.employees)
    },
    error=>{
      alert("error")
    });

  }

}
