import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeeService } from './employee.service';
import {MatSnackBar} from '@angular/material';
declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})

export class EmployeeComponent implements OnInit {
  checked = false;
  isOpened = 0;

  togglePanel(index:number) {
    this.isOpened = index;
  }

  collapse() {
    this.isOpened=0;
    this.addEmpForm.reset();
  }
  addEmpForm = new FormGroup({
    empFullName: new FormControl(''),
    empUserName: new FormControl(''),
    empPassword: new FormControl(''),
    empType: new FormControl(''),
  })

  private globalDataTable;
  private employee:any;
  constructor(private empServ:EmployeeService,public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllEmp();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  displayTable(){
    setTimeout(function () {$(function () {$('#empTable').DataTable();});}, 10);  
  }
  getAllEmp(){
    this.empServ.getAllEmp().subscribe(Response=>{
      empServ => this.employee = empServ; this.employee=Response;
      this.displayTable();
    },
      error=>{
        alert("error")
      });
  }
  addNewEmployee(){
    this.empServ.addNewClient(this.addEmpForm.value).subscribe(
      Response=>{
      this.openSnackBar(this.addEmpForm.value['empFullName'], "Successfully Added");
      
      /* START- collapse accordion and rest form values */
      this.isOpened=0;
      this.addEmpForm.reset();
      /* END- collapse accordion and rest form values */
      this.getAllEmp();
    },
    error=>{
      alert("error");
    });
  }
  
}
