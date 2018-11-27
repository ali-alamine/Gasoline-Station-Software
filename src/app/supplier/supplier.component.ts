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
    PID : new FormControl(''),
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
  typeSubmit = 'إضافة';
  
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
    this.typeSubmit = 'إضافة';
  }
  // displayTable(){
  //   setTimeout(function () {$(function () {$('#SupplierDT').DataTable();});}, 10);  
  // }
  addEditSupplier(){
    if(this.editFlag == false){
      this.supplierServ.addSupplier(this.supplierForm.value).subscribe(
        Response=>{
          this.openSnackBar(this.supplierForm.value['name'], "إضافة ناجحة");
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
          this.openSnackBar(this.supplierForm.value['name'], "تعديلات ناجحة");
          /* START- collapse accordion and rest form values */
          this.isOpened=0;
          this.supplierForm.reset();
          this.editFlag = true;
          this.typeSubmit = 'إضافة';
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
      fixedHeader: false,
      select: {
        style: "single"
      },
      searching: true,
      lengthMenu: [[50, 100, 150], [50, 100, 150]],
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
        { data: "full_name", title: "الإسم" },
        { data: "phone_number", title: "رقم الهاتف" },
        { data: "debitAmount", title: "الدين" , render: $.fn.dataTable.render.number(',', '.', 0, 'ل.ل ') }

      ],
      language: {
        sProcessing: " جارٍ التحميل... ",
        sLengthMenu: " أظهر _MENU_ مدخلات ",
        sZeroRecords: " لم يعثر على أية سجلات ",
        sInfo: " إظهار _START_ إلى _END_ من أصل _TOTAL_ مدخل ",
        sInfoEmpty: " يعرض 0 إلى 0 من أصل 0 سجل ",
        sInfoFiltered: "( منتقاة من مجموع _MAX_ مُدخل )",
        sInfoPostFix: "",
        sSearch: " ابحث: ",
        sUrl: "",
        oPaginate: {
          sFirst: " الأول ",
          sPrevious: " السابق ",
          sNext: " التالي ",
          sLast: " الأخير "
        },
        select: {
          rows: {
            _: "||  %d أسطر محدد  ",
            0: "||  انقر فوق صف لتحديده ",
            1: "||  صف واحد محدد  "
          }
        }
      }
    });

    this.items = [
      {
        label: 'تعديل',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editBtn') as HTMLElement;
          element.click();
        }

      },{
        label: "حذف",
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
      this.isOpened=1;
      this.typeSubmit = "تعديل";
      this.supplierForm.get('PID').setValue(SupplierComponent.selectedSupplierID);
      this.supplierForm.get('name').setValue(SupplierComponent.selectedRowData["full_name"]);
      this.supplierForm.get('phone').setValue(SupplierComponent.selectedRowData["phone_number"]);
      this.supplierForm.get('initDebitAmount').setValue(SupplierComponent.selectedRowData["debitAmount"]);
  }
  deleteSupplier() {
    Swal({
      title: "حذف",
      text: "هل حقا تريد حذفها؟",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم!",
      cancelButtonText: "كلا"
    }).then(result => {
      if (result.value) {
        this.supplierServ
          .deleteSupplier(SupplierComponent.selectedSupplierID)
          .subscribe(
            Response => {
              this.globalSupplierDT.ajax.reload(null, false);
              Swal({
                type: "success",
                title: "نجاح الحذف",
                showConfirmButton: false,
                timer: 1000
              });
            },
            error => {
              Swal({
                type: "error",
                title: "تحذير",
                text: "هذا المورد موجود في الفواتير",
                confirmButtonText: "نعم",
              });
            }
          );
      }
    });
  }
}
