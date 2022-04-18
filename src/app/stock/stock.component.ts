import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar} from '@angular/material';
import { StockService} from './stock.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
  modalReference: any;
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
  editContainerLitersForm= new FormGroup({
    quantity_liter:new FormControl ('')
  })
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
  typeSubmitLub = 'إضافة';

  
  private static selectedRowAccessData;
  private static selectedAccessID;
  private globalAccessDT;
  itemsAccess: MenuItem[];
  editAccessFlag = false;
  container_name:String;
  container_currentQuantity:any;
  container_capacity:any;
  container_price_liter:any;
  container_totalPrice:any;
  contID:any;
  typeSubmitAccess = 'إضافة';

  constructor(private stockServ: StockService,public snackBar: MatSnackBar,private modalService: NgbModal) { }
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
    this.typeSubmitLub = 'إضافة';
  }
  togglePanelAccess(index:number) {
    this.isOpenedAccess = index;
  }
  collapseAccess() {
    this.isOpenedAccess=0;
    this.addAccessForm.reset();
    this.editAccessFlag = false;
    this.typeSubmitAccess = 'إضافة';
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
        fixedHeader: false,
        select: {
          style: "single"
        },
        searching: true,
        lengthMenu: [[50, 100, 150], [50, 100, 150]],
        ajax: {
          type: "get",
          url: "http://localhost/gasoline-station-software/src/assets/api/dataTables/stockDataTable.php",
          data : {'type' : 'lub'},
          cache: true,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          // { data: "empID", title: "#" },
          { data: "name", title: "الإسم" },
          { data: "quantity", title: "الكمية" },
          { data: "selling_price", title: "سعر البيع","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')},
          { data: "cost", title: "سعر الشراء","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')},
          { data: "total", title: "المجموع" ,"searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')}
  
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
  
      this.itemsLub = [
        {
          label: 'تعديل',
          icon: 'pi pi-fw pi-pencil',
          command: (event) => {
            let element: HTMLElement = document.getElementById('editLubBtn') as HTMLElement;
            element.click();
          }
  
        },{
          label: "حذف",
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
      fixedHeader: false,
      select: {
        style: "single"
      },
      searching: true,
      lengthMenu: [[50, 100, 150], [50, 100, 150]],
      ajax: {
        type: "get",
          url: "http://localhost/gasoline-station-software/src/assets/api/dataTables/stockDataTable.php",
          data : {'type' : 'access'},
          cache: true,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          // { data: "empID", title: "#" },
          { data: "name", title: "الإسم" },
          { data: "quantity", title: "الكمية" },
          { data: "selling_price", title: "سعر البيع","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')},
          { data: "cost", title: "سعر الشراء","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')},
          { data: "total", title: "المجموع" ,"searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ')}

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

      this.itemsAccess = [
        {
          label: 'تعديل',
          icon: 'pi pi-fw pi-pencil',
          command: (event) => {
            let element: HTMLElement = document.getElementById('editAccessBtn') as HTMLElement;
            element.click();
          }

        },{
          label: "حذف",
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
        console.log(this.containers)
    }
  );
  }
  displayTables(selectedTab){
    if(selectedTab.index==1){
      this.getAllLubricants();
    }
    if(selectedTab.index==2){
      this.getAllAccess();
    }
  }
  openLubModal() {
      this.isOpened=1;
      this.typeSubmitLub = "تعديل";
      this.addLubForm.get('itemID').setValue(StockComponent.selectedRowLubData["itemID"]);
      this.addLubForm.get('name').setValue(StockComponent.selectedRowLubData["name"]);
      this.addLubForm.get('quantity').setValue(StockComponent.selectedRowLubData["quantity"]);
      this.addLubForm.get('selling').setValue(StockComponent.selectedRowLubData["selling_price"]);
      this.addLubForm.get('cost').setValue(StockComponent.selectedRowLubData["cost"]);
  }
  openDetail(name){
    alert(name)
  }
  openAccessModal() {
    this.isOpenedAccess=1;
    this.typeSubmitAccess = "تعديل";
    this.addAccessForm.get('itemID').setValue(StockComponent.selectedRowAccessData["itemID"]);
    this.addAccessForm.get('name').setValue(StockComponent.selectedRowAccessData["name"]);
    this.addAccessForm.get('quantity').setValue(StockComponent.selectedRowAccessData["quantity"]);
    this.addAccessForm.get('selling').setValue(StockComponent.selectedRowAccessData["selling_price"]);
    this.addAccessForm.get('cost').setValue(StockComponent.selectedRowAccessData["cost"]);
  }
  deleteLub() {
    Swal({
      title: "تأكيد الحذف",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم!",
      cancelButtonText: "كلا"
    }).then(result => {
      if (result.value) {
        this.stockServ
          .deleteStock(StockComponent.selectedLubID)
          .subscribe(
            Response => {
              this.globalLubDT.ajax.reload(null, false);
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
                text: "هذا الزيت موجود في الفواتير",
                confirmButtonText: "نعم",
              });
            }
          );
      }
    });
  }
  deleteAccess() {
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
        this.stockServ
          .deleteStock(StockComponent.selectedAccessID)
          .subscribe(
            Response => {
              this.globalAccessDT.ajax.reload(null, false);
              Swal({
                type: "success",
                title: "نجاح الحذف",
                showConfirmButton: false,
                timer: 1000
              });
            },
            error => {
              Swal({
                title: "تحذير",
                text: "هذا الإكسسوار موجود في الفواتير",
                confirmButtonText: "نعم",
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
          this.openSnackBar(this.addLubForm.value['name'], "إضافة ناجحة");
          /* START- collapse accordion and rest form values */
          // this.isOpened=0;
          // this.isOpenedAccess=0;
          this.addLubForm.reset();
          /* END- collapse accordion and rest form values */
          this.collapse();
              this.globalLubDT.ajax.reload(null, false);
              // this.getAllLubricants();
      },
      error=>{
        alert("error");
      });
    } else{
      this.stockServ.editStock(this.addLubForm.value).subscribe(
        Response=>{
          this.openSnackBar(this.addLubForm.value['name'], "تعديلات ناجحة");
          /* START- collapse accordion and rest form values */
          // this.isOpened=0;
          this.editLubFlag = false;
          // this.typeSubmitLub = 'إضافة';
          /* END- collapse accordion and rest form values */
          this.addLubForm.reset();
        this.collapse();
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
        this.openSnackBar(this.addAccessForm.value['name'], "إضافة ناجحة");
        /* START- collapse accordion and rest form values */
        // this.isOpenedAccess=0;
        this.addAccessForm.reset();
      this.collapseAccess();
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
        this.openSnackBar(this.addAccessForm.value['name'], "تعديلات ناجحة");
        /* START- collapse accordion and rest form values */
        // this.isOpened=0;
        this.addAccessForm.reset();
      this.collapseAccess();

        this.editAccessFlag = false;
        // this.typeSubmitAccess = 'إضافة';
        /* END- collapse accordion and rest form values */
            this.globalAccessDT.ajax.reload(null, false);
    },
    error=>{
      alert("error");
    });
  }
  }
  changeQuantity(){
    if(this.contID){
      this.stockServ.changeContainerQuantity(this.contID,this.editContainerLitersForm.value.quantity_liter).subscribe(
        response => {
          this.getAllFuelContainers();
          this.editContainerLitersForm.get('quantity_liter').setValue(this.editContainerLitersForm.value.quantity_liter);
          this.container_currentQuantity=this.editContainerLitersForm.value.quantity_liter;
          this.editContainerLitersForm.reset();
          Swal("success")
        },
        error => {alert("error updating qunatity")}
      )    
    }
 
  }
  openContainerModal(contID,containerModal,container_name,currentQuan,capacity,price_liter){
    this.contID=contID;
    this.container_name=container_name;
    this.container_currentQuantity=currentQuan;
    this.container_capacity=capacity;
    this.container_price_liter=price_liter;
    this.container_totalPrice=price_liter*capacity;
    this.modalReference = this.modalService.open(containerModal, {
      centered: true,
      ariaLabelledBy: "modal-basic-title"
    });

  }
}
