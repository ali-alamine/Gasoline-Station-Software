import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeeService } from './employee.service';
import {MatSnackBar} from '@angular/material';
declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';
import { MenuItem } from '../../../node_modules/primeng/api';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})

export class EmployeeComponent implements OnInit {
  checked = false;
  isOpened = 0;
  private static selectedRowData;
  private static selectedEmployeeID;
  editedEmployeeData = {};
  private globalEmployeeDT;
  items: MenuItem[];
  editFlag = false;
  typeSubmit = 'Add';

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
  // displayTable(){
  //   setTimeout(function () {$(function () {$('#empTable').DataTable();});}, 10);  
  // }
  getAllEmp(){
    // this.empServ.getAllEmp().subscribe(Response=>{
    //   empServ => this.employee = empServ; this.employee=Response;
    //   this.displayTable();
    // },
    //   error=>{
    //     alert("error")
    //   });
    var subscriberDataTable = $('#employeeDT').DataTable({
      responsive: false,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      stateSave: false,
      fixedHeader: true,
      select: {
        "style": "single"
      },
      searching: true,
      lengthMenu: [[5, 10, 25, 50, 100, 150, 200, 300], [5, 10, 25, 50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
        url: "http://localhost/eSafe-gasoline_station/src/assets/api/dataTables/employeeDT.php",
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "empID", title: "ID" },
        { data: "name", title: "Full Name" },
        { data: "user_name", title: "username" },
        { data: "passKey", title: "password"},
        { data: "userType", title: "type"}

      ],
      "columnDefs": [
        {
          "targets": 4,
          "data": "userType",
          "render": function (data, type, rowData, meta) {
            if (data == '0') {
              return 'Employee';
            } else{
              return 'Admin';
            }    
          }
        }
      ]
    });

    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editBtn') as HTMLElement;
          element.click();
        }

      },{
        label: "Delete",
        icon: "pi pi-fw pi-times",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "deleteBtn"
          ) as HTMLElement;
          element.click();
        }
      },
    ];
    this.globalEmployeeDT = subscriberDataTable;

    subscriberDataTable.on('select', function (e, dt, type, indexes) {

      if (type === 'row') {
        EmployeeComponent.selectedRowData = subscriberDataTable.row(indexes).data();
        var ID = subscriberDataTable.row(indexes).data()['PID'];
        var name = subscriberDataTable.row(indexes).data()['full_name'];
        EmployeeComponent.selectedEmployeeID = ID;
        // ClientComponent.selectedClientName = name;
      }
      else if (type === 'column') {
        EmployeeComponent.selectedEmployeeID = -1;
      }
    });

    $('#employeeDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        subscriberDataTable.row(this).select();
      }
    });

    $('#employeeDT').on('key-focus.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).addClass('selected');

    });
    $('#employeeDT').on('key-blur.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).removeClass('selected');
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
