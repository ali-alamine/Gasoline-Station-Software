import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeeService } from './employee.service';
import {MatSnackBar} from '@angular/material';
declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';
import { MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})

export class EmployeeComponent implements OnInit {
  private static selectedRowData;
  private static selectedEmployeeID;
  checked = false;
  isOpened = 0;
  private globalEmployeeDT;
  items: MenuItem[];
  editFlag = false;
  typeSubmit = 'Add';

  private globalDataTable;
  private employee: any;

  addEmpForm = new FormGroup({
    empFullName: new FormControl(''),
    empUserName: new FormControl(''),
    empPassword: new FormControl(''),
    empType: new FormControl(''),
    empID: new FormControl(''),
  });

  togglePanel(index: number) {
    this.isOpened = index;
  }

  collapse() {
    this.isOpened = 0;
    this.addEmpForm.reset();
    this.editFlag = false;
    this.typeSubmit = 'addition';
  }

  constructor(private empServ: EmployeeService, public snackBar: MatSnackBar) { }

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
  getAllEmp() {
    // tslint:disable-next-line: prefer-const
    let subscriberDataTable = $('#employeeDT').DataTable({
      responsive: false,
      paging: true,
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      ordering: true,
      stateSave: false,
      fixedHeader: false,
      select: {
        style: 'single'
      },
      searching: true,
      lengthMenu: [[50, 100, 150], [50, 100, 150]],
      ajax: {
        type: 'get',
        url: 'http://localhost:4200/Gasoline-Station-Software/src/assets/api/dataTables/employeeDT.php',
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: 'empID', title: 'ID' },
        { data: 'name', title: 'full name'},
        { data: 'user_name', title: 'User Name' },
        { data: 'passkey', title: 'Password'},
        { data: 'user_type', title: 'User Type'}

      ],
      'columnDefs': [
        {
          'targets': 4,
          'data': 'user_type',
          'render': function (data, type, rowData, meta) {
            if (data === 0) {
              return 'Employee';
            } else if (data === 1) {
              return 'Admin';
            }
          }
        }
      ],
      language: {
        sProcessing: 'Loading...',
        sLengthMenu: 'show _MENU_ input',
        sZeroRecords: 'No records found',
        sInfo: 'Show _START_ to _END_ of the origin of the _TOTAL_ entry',
        sInfoEmpty: 'Displays 0 to 0 out of 0 records',
        sInfoFiltered: '(selected from sum of _MAX_ entered)',
        sInfoPostFix: '',
        sSearch: 'Search: ',
        sUrl: '',
        oPaginate: {
          sFirst: 'first',
          sPrevious: 'prev',
          sNext: 'Next',
          sLast: 'last'
        },
        select: {
          rows: {
            _: '||  %d selected lines',
            0: '||  Click a row to select it',
            1: '|| single row selected'
          }
        }
      }
    });

    this.items = [
      {
        label: 'Modification',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          // tslint:disable-next-line: prefer-const
          let element: HTMLElement = document.getElementById('editBtn') as HTMLElement;
          element.click();
        }

      }, {
        label: 'Delete',
        icon: 'pi pi-fw pi-times',
        command: event => {
          // tslint:disable-next-line: prefer-const
          let element: HTMLElement = document.getElementById(
            'deleteBtn'
          ) as HTMLElement;
          element.click();
        }
      },
    ];
    this.globalEmployeeDT = subscriberDataTable;

    subscriberDataTable.on('select', function (e, dt, type, indexes) {

      if (type === 'row') {
        EmployeeComponent.selectedRowData = subscriberDataTable.row(indexes).data();
        const ID = subscriberDataTable.row(indexes).data()['empID'];
        const name = subscriberDataTable.row(indexes).data()['full_name'];
        EmployeeComponent.selectedEmployeeID = ID;
        // EmployeeComponent.selectedClientName = name;
      } else if (type === 'column') {
        EmployeeComponent.selectedEmployeeID = -1;
      }
    });

    $('#employeeDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which === 3) {
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
  addNewEmployee() {
    if (this.editFlag === false) {
      this.empServ.addNewEmployee(this.addEmpForm.value).subscribe(
        Response => {
        this.openSnackBar(this.addEmpForm.value['empFullName'], 'Successful addition');

        /* START- collapse accordion and rest form values */
        // this.isOpened=0;
        this.addEmpForm.reset();
          this.collapse();
          /* END- capsollapse accordion and rest form values */
        this.globalEmployeeDT.ajax.reload(null, false);
      },
      error => {
        alert('error on employee 1');
      });
    } else {
      this.empServ.editEmployee(this.addEmpForm.value).subscribe(
        Response => {
          this.openSnackBar(this.addEmpForm.value['empFullName'], 'Successful edits');
          /* START- collapse accordion and rest form values */
          // this.isOpened=0;
          this.addEmpForm.reset();
          this.collapse();
          this.editFlag = true;
          // this.typeSubmit = 'إضافة';
          /* END- collapse accordion and rest form values */
              this.globalEmployeeDT.ajax.reload(null, false);
      },
      error => {
        alert('error on employee 2');
      });
    }

  }
  openEmployeeModal() {
      this.isOpened = 1;
      this.typeSubmit = 'Modification';
      this.addEmpForm.get('empID').setValue(EmployeeComponent.selectedEmployeeID);
      this.addEmpForm.get('empFullName').setValue(EmployeeComponent.selectedRowData['name']);
      this.addEmpForm.get('empUserName').setValue(EmployeeComponent.selectedRowData['user_name']);
      this.addEmpForm.get('empPassword').setValue(EmployeeComponent.selectedRowData['passkey']);
      if (EmployeeComponent.selectedRowData['user_type'] === 1) {
        this.checked = true;
        } else {
        this.checked = false;
        }
  }
  deleteEmployee() {
    Swal({
      title: 'Delete',
      text: 'Do you really want to delete it?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'Both'
    }).then(result => {
      if (result.value) {
        this.empServ
          .deleteEmployee(EmployeeComponent.selectedEmployeeID)
          .subscribe(
            Response => {
              this.globalEmployeeDT.ajax.reload(null, false);
              Swal({
                type: 'success',
                title: 'delete success',
                showConfirmButton: false,
                timer: 1000
              });
            },
            error => {
              Swal({
                type: 'error',
                title: 'warning',
                text: 'This employee is in the invoices',
                confirmButtonText: 'Yes',
    });
            }
          );
      }
    });
  }

}
