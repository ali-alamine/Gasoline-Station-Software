import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar} from '@angular/material';
import { StockService} from './stock.service'
declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';
import { MenuItem } from 'primeng/api';
import Swal from "sweetalert2";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})

export class StockComponent implements OnInit {
  containers:any;
  itemName = new FormControl('');
  itemPrice = new FormControl('');
  private globalDataTable;
  private lubricants:any;
  private accessories:any;
  private fuelContainers:any;
  private fuelColor:any='lightblue';

  addLubForm = new FormGroup({
    itemID: new FormControl(''),
    name: new FormControl(''),
    quantity: new FormControl(''),
    selling: new FormControl(''),
    cost: new FormControl('')
  });
  addAccessForm = new FormGroup({
    itemID: new FormControl(''),
    name: new FormControl(''),
    quantity: new FormControl(''),
    selling: new FormControl(''),
    cost: new FormControl('')
  });
  isOpened = 0;
  isOpenedAccess = 0;
  
  private static selectedRowLubData;
  private static selectedLubID;
  private globalLubDT;
  itemsLub: MenuItem[];
  editLubFlag = false;
  typeSubmitLub = 'Add';

  
  private static selectedRowAccessData;
  private static selectedAccessID;
  private globalAccessDT;
  itemsAccess: MenuItem[];
  editAccessFlag = false;
  typeSubmitAccess = 'Add';

  constructor(private stockServ: StockService,public snackBar: MatSnackBar) { }
  ngOnInit(){
    // this.getAllLubricants();
    // this.getAllAccess();
    this.getAllFuelContainers();
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
    this.addLubForm.reset();
    this.editLubFlag = false;
    this.typeSubmitLub = 'Add';
  }
  togglePanelAccess(index:number) {
    this.isOpenedAccess = index;
  }
  collapseAccess() {
    this.isOpenedAccess=0;
    this.addAccessForm.reset();
    this.editAccessFlag = false;
    this.typeSubmitAccess = 'Add';
  }
  getAllLubricants(){
    // this.stockServ.getAllLubricants().subscribe(Response=>{
     
    //   stockServ => this.lubricants = stockServ;
    //   this.lubricants=Response;
    // },
    // error=>{
    //   alert("error")
    // });
    if(this.globalLubDT == null){

      var subscriberDataTable = $('#lubDT').DataTable({
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
        // data: this.accessories,
        ajax: {
          type: "get",
          url: "http://localhost/eSafe-gasoline_station/src/assets/api/dataTables/stockDataTable.php",
          data : {'type' : 'lub'},
          cache: true,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          // { data: "empID", title: "#" },
          { data: "name", title: "Name" },
          { data: "quantity", title: "Quantity" },
          { data: "selling_price", title: "Selling Price","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')},
          { data: "cost", title: "Cost","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')},
          { data: "total", title: "Total" ,"searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')}
  
        ],
        // "columnDefs": [
        //   {
        //     "targets": 4,
        //     "data": "user_type",
        //     "render": function (data, type, rowData, meta) {
        //       if (data == 0) {
        //         return 'Employee';
        //       } else if (data == 1){
        //         return 'Admin';
        //       }    
        //     }
        //   }
        // ]
      });
  
      this.itemsLub = [
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          command: (event) => {
            let element: HTMLElement = document.getElementById('editLubBtn') as HTMLElement;
            element.click();
          }
  
        },{
          label: "Delete",
          icon: "pi pi-fw pi-times",
          command: event => {
            let element: HTMLElement = document.getElementById(
              "deleteLubBtn"
            ) as HTMLElement;
            element.click();
          }
        },
      ];
      this.globalLubDT = subscriberDataTable;
  
      subscriberDataTable.on('select', function (e, dt, type, indexes) {
  
        if (type === 'row') {
          StockComponent.selectedRowLubData = subscriberDataTable.row(indexes).data();
          var ID = subscriberDataTable.row(indexes).data()['itemID'];
          var name = subscriberDataTable.row(indexes).data()['name'];
          StockComponent.selectedLubID = ID;
          // StockComponent.selectedClientName = name;
        }
        else if (type === 'column') {
          StockComponent.selectedLubID = -1;
        }
      });
  
      $('#lubDT tbody').on('mousedown', 'tr', function (event) {
        if (event.which == 3) {
          subscriberDataTable.row(this).select();
        }
      });
  
      $('#lubDT').on('key-focus.dt', function (e, datatable, cell) {
        $(subscriberDataTable.row(cell.index().row).node()).addClass('selected');
  
      });
      $('#lubDT').on('key-blur.dt', function (e, datatable, cell) {
        $(subscriberDataTable.row(cell.index().row).node()).removeClass('selected');
      });
    }else{
      this.globalLubDT.ajax.reload(null, false);
    }
  }
  getAllAccess(){
    if(this.globalAccessDT == null){
      var subscriberDataTable = $('#accessDT').DataTable({
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
        // data: this.accessories,
        ajax: {
          type: "get",
          url: "http://localhost/eSafe-gasoline_station/src/assets/api/dataTables/stockDataTable.php",
          data : {'type' : 'access'},
          cache: true,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          // { data: "empID", title: "#" },
          { data: "name", title: "Name" },
          { data: "quantity", title: "Quantity" },
          { data: "selling_price", title: "Selling Price","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')},
          { data: "cost", title: "Cost","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')},
          { data: "total", title: "Total" ,"searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')}

        ],
        // "columnDefs": [
        //   {
        //     "targets": 4,
        //     "data": "user_type",
        //     "render": function (data, type, rowData, meta) {
        //       if (data == 0) {
        //         return 'Employee';
        //       } else if (data == 1){
        //         return 'Admin';
        //       }    
        //     }
        //   }
        // ]
      });

      this.itemsAccess = [
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          command: (event) => {
            let element: HTMLElement = document.getElementById('editAccessBtn') as HTMLElement;
            element.click();
          }

        },{
          label: "Delete",
          icon: "pi pi-fw pi-times",
          command: event => {
            let element: HTMLElement = document.getElementById(
              "deleteAccessBtn"
            ) as HTMLElement;
            element.click();
          }
        },
      ];
      this.globalAccessDT = subscriberDataTable;

      subscriberDataTable.on('select', function (e, dt, type, indexes) {

        if (type === 'row') {
          StockComponent.selectedRowAccessData = subscriberDataTable.row(indexes).data();
          var ID = subscriberDataTable.row(indexes).data()['itemID'];
          var name = subscriberDataTable.row(indexes).data()['name'];
          StockComponent.selectedAccessID = ID;
          // StockComponent.selectedClientName = name;
        }
        else if (type === 'column') {
          StockComponent.selectedAccessID = -1;
        }
      });

      $('#accessDT tbody').on('mousedown', 'tr', function (event) {
        if (event.which == 3) {
          subscriberDataTable.row(this).select();
        }
      });

      $('#accessDT').on('key-focus.dt', function (e, datatable, cell) {
        $(subscriberDataTable.row(cell.index().row).node()).addClass('selected');

      });
      $('#accessDT').on('key-blur.dt', function (e, datatable, cell) {
        $(subscriberDataTable.row(cell.index().row).node()).removeClass('selected');
      });
    }else{
      this.globalAccessDT.ajax.reload(null, false);
    }
  }
  getAllFuelContainers(){
    this.stockServ.getAllFuelContainers().subscribe( 
      Response=>{
        this.containers = Response;
        console.log(Response)
        console.log( this.containers);
    }
  );
}
  displayTables(selectedTab){
  // debugger
    if(selectedTab.index==1){
      this.getAllLubricants();
      //  var cc=$("#lubDT").DataTable();
      //  this.globalDataTable=cc;
    }
    if(selectedTab.index==2){
      this.getAllAccess();
      //  var cc=$("#accessDT").DataTable();
      //  this.globalDataTable=cc;
    }
  }
  openLubModal() {
      this.typeSubmitLub = "Edit";
      this.addLubForm.get('itemID').setValue(StockComponent.selectedRowLubData["itemID"]);
      this.addLubForm.get('name').setValue(StockComponent.selectedRowLubData["name"]);
      this.addLubForm.get('quantity').setValue(StockComponent.selectedRowLubData["quantity"]);
      this.addLubForm.get('selling').setValue(StockComponent.selectedRowLubData["selling_price"]);
      this.addLubForm.get('cost').setValue(StockComponent.selectedRowLubData["cost"]);
  }
  openAccessModal() {
    this.typeSubmitAccess = "Edit";
    this.addAccessForm.get('itemID').setValue(StockComponent.selectedRowAccessData["itemID"]);
    this.addAccessForm.get('name').setValue(StockComponent.selectedRowAccessData["name"]);
    this.addAccessForm.get('quantity').setValue(StockComponent.selectedRowAccessData["quantity"]);
    this.addAccessForm.get('selling').setValue(StockComponent.selectedRowAccessData["selling_price"]);
    this.addAccessForm.get('cost').setValue(StockComponent.selectedRowAccessData["cost"]);
  }
  deleteLub() {
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
        this.stockServ
          .deleteStock(StockComponent.selectedLubID)
          .subscribe(
            Response => {
              this.globalLubDT.ajax.reload(null, false);
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
                text: "This item is in invoices",
                confirmButtonText: "Ok",
              });
            }
          );
      }
    });
  }
  deleteAccess() {
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
        this.stockServ
          .deleteStock(StockComponent.selectedAccessID)
          .subscribe(
            Response => {
              this.globalAccessDT.ajax.reload(null, false);
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
                text: "This item is in invoices",
                confirmButtonText: "Ok",
              });
            }
          );
      }
    });
  }
  addLubricant(){
    if(this.editLubFlag == false){
      this.stockServ.addNewLub(this.addLubForm.value).subscribe(
        Response=>{
          this.openSnackBar(this.addLubForm.value['name'], "Successfully Added");
          /* START- collapse accordion and rest form values */
          this.isOpened=0;
          this.isOpenedAccess=0;
          this.addLubForm.reset();
          /* END- collapse accordion and rest form values */
              this.globalLubDT.ajax.reload(null, false);
              // this.getAllLubricants();
      },
      error=>{
        alert("error");
      });
    } else{
      this.stockServ.editStock(this.addLubForm.value).subscribe(
        Response=>{
          this.openSnackBar(this.addLubForm.value['name'], "Successfully Edit");
          /* START- collapse accordion and rest form values */
          this.isOpened=0;
          this.addLubForm.reset();
          this.editLubFlag = false;
          this.typeSubmitLub = 'Add';
          /* END- collapse accordion and rest form values */
              this.globalLubDT.ajax.reload(null, false);
      },
      error=>{
        alert("error");
      });
    }
    
  }
  addNewAccess(){
    if(this.editAccessFlag == false){
      this.stockServ.addNewAccess(this.addAccessForm.value).subscribe(
      Response=>{
        this.openSnackBar(this.addAccessForm.value['name'], "Successfully Added");
        /* START- collapse accordion and rest form values */
        this.isOpenedAccess=0;
        this.addAccessForm.reset();
        /* END- collapse accordion and rest form values */
            this.globalAccessDT.ajax.reload(null, false);
            // this.getAllAccess();
    },
    error=>{
      alert("error");
    });
  } else{
    this.stockServ.editStock(this.addAccessForm.value).subscribe(
      Response=>{
        this.openSnackBar(this.addAccessForm.value['name'], "Successfully Edit");
        /* START- collapse accordion and rest form values */
        this.isOpened=0;
        this.addAccessForm.reset();
        this.editAccessFlag = false;
        this.typeSubmitAccess = 'Add';
        /* END- collapse accordion and rest form values */
            this.globalAccessDT.ajax.reload(null, false);
    },
    error=>{
      alert("error");
    });
  }
  }
 
  
}
