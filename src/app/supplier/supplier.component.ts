import { Component, OnInit } from '@angular/core';
import{ SupplierService} from './supplier.service'
import { FormGroup, FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { MenuItem } from 'primeng/api';
import Swal from "sweetalert2";

declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  supplierForm = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl(''),
    initDebitAmount: new FormControl(''),
    isClient : new FormControl(0)
  })
  isOpened = 0;
  private clients:any;
  
  private static selectedRowData;
  private static selectedSupplierID;
  editedSupplierData = {};
  private globalSupplierDT;
  items: MenuItem[];
  editFlag = false;
  typeSubmit = 'Add';
  
  constructor(private supplierServ:SupplierService,public snackBar: MatSnackBar) { }
  
  ngOnInit() {
    this.getAllSuppliers();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  togglePanel(index:number) {
    this.isOpened = index;
  }
  collapse() {
    this.isOpened=0;
    this.supplierForm.reset();
    this.editFlag = false;
    this.typeSubmit = 'Add';
  }
  // displayTable(){
  //   setTimeout(function () {$(function () {$('#SupplierDT').DataTable();});}, 10);  
  // }
  addEditSupplier(){
    console.log(this.supplierForm.value)
    if(this.editFlag == false){
      this.supplierServ.addSupplier(this.supplierForm.value).subscribe(
        Response=>{
          this.openSnackBar(this.supplierForm.value['name'], "Successfully Added");
          /* START- collapse accordion and rest form values */
          this.isOpened=0;
          this.supplierForm.reset();
          /* END- collapse accordion and rest form values */
              this.globalSupplierDT.ajax.reload(null, false);
              // this.getAllClients();
      },
      error=>{
        alert("error");
      });
    } else{
      this.supplierServ.editSupplier(this.supplierForm.value).subscribe(
        Response=>{
          this.openSnackBar(this.supplierForm.value['name'], "Successfully Edit");
          /* START- collapse accordion and rest form values */
          this.isOpened=0;
          this.supplierForm.reset();
          this.editFlag = true;
          this.typeSubmit = 'Add';
          /* END- collapse accordion and rest form values */
              this.globalSupplierDT.ajax.reload(null, false);
              // this.getAllClients();
      },
      error=>{
        alert("error");
      });
    }
  }
  getAllSuppliers(){
     var subscriberDataTable = $('#suppliersDT').DataTable({
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
        url: "http://localhost/eSafe-gasoline_station/src/assets/api/dataTables/personDataTable.php",
        data: {'type': 0},
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "PID", title: "ID" },
        { data: "full_name", title: "Name" },
        { data: "phone_number", title: "Phone" },
        { data: "debitAmount", title: "Debit" , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }

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
    this.globalSupplierDT = subscriberDataTable;

    subscriberDataTable.on('select', function (e, dt, type, indexes) {

      if (type === 'row') {
        SupplierComponent.selectedRowData = subscriberDataTable.row(indexes).data();
        var ID = subscriberDataTable.row(indexes).data()['PID'];
        var name = subscriberDataTable.row(indexes).data()['full_name'];
        SupplierComponent.selectedSupplierID = ID;
        // ClientComponent.selectedClientName = name;
      }
      else if (type === 'column') {
        SupplierComponent.selectedSupplierID = -1;
      }
    });

    $('#suppliersDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        subscriberDataTable.row(this).select();
      }
    });

    $('#suppliersDT').on('key-focus.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).addClass('selected');

    });
    $('#suppliersDT').on('key-blur.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).removeClass('selected');
    });

  }
  openSupplierModal() {
      this.typeSubmit = "Edit";
      this.supplierForm.get('name').setValue(SupplierComponent.selectedRowData["full_name"]);
      this.supplierForm.get('phone').setValue(SupplierComponent.selectedRowData["phone_number"]);
      this.supplierForm.get('initDebitAmount').setValue(SupplierComponent.selectedRowData["debitAmount"]);
  }
  deleteSupplier() {
    
    console.log(SupplierComponent.selectedSupplierID)
    Swal({
      title: "Delete",
      text: "you really want to delete?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes!",
      cancelButtonText: "No"
    }).then(result => {
      if (result.value) {
        this.supplierServ
          .deleteSupplier(SupplierComponent.selectedSupplierID)
          .subscribe(
            Response => {
              this.globalSupplierDT.ajax.reload(null, false);
              Swal({
                type: "success",
                title: "Success",
                showConfirmButton: false,
                timer: 1000
              });
            },
            error => {
              Swal({
                type: "error",
                title: "Warning",
                text: "This customer is in invoices",
                confirmButtonText: "Ok",
    });
            }
          );
      }
    });
  }
}
