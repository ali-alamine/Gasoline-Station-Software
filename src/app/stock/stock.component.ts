import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar} from '@angular/material';
import { StockService} from './stock.service'
declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})

export class StockComponent implements OnInit {
  itemName = new FormControl('');
  itemPrice = new FormControl('');
  private globalDataTable;
  private lubricants:any;
  private accessories:any;
  private fuelContainers:any;
  private fuelColor:any='lightblue';

  addLubForm = new FormGroup({
    lubName: new FormControl(''),
    lubInitQuan: new FormControl(''),
    lubSellingPrice: new FormControl(''),
    lubCostPrice: new FormControl(''),
  });
  addAccessForm = new FormGroup({
    accessName: new FormControl(''),
    accessInitQuan: new FormControl(''),
    accessSellingPrice: new FormControl(''),
    accessCostPrice: new FormControl(''),
  });
  isOpened = 0;
  isOpenedAccess = 0;

  constructor(private stockServ: StockService,public snackBar: MatSnackBar) { }
  ngOnInit(){
    this.getAllLubricants();
    this.getAllAccess();
    this.getAllFuelContainers();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  addLubricant(){
    this.stockServ.addNewLub(this.addLubForm.value).subscribe(
      Response=>{
        this.openSnackBar(this.addLubForm.value['lubName'], "Successfully Added");
        /* START- collapse accordion and rest form values */
        this.isOpened=0;
        this.isOpenedAccess=0;
        this.addLubForm.reset();
        /* END- collapse accordion and rest form values */
      this.getAllLubricants();
    },
    error=>{
      alert("error");
    });
  }
  addNewAccess(){
    this.stockServ.addNewAccess(this.addAccessForm.value).subscribe(
      Response=>{
        this.openSnackBar(this.addAccessForm.value['accessName'], "Successfully Added");
        /* START- collapse accordion and rest form values */
        this.isOpenedAccess=0;
        this.addAccessForm.reset();
        /* END- collapse accordion and rest form values */
      this.getAllAccess();
    },
    error=>{
      alert("error");
    });
  }
  togglePanel(index:number) {
    this.isOpened = index;
  }
  collapse() {
    this.isOpened=0;
    this.addLubForm.reset();
  }
  togglePanelAccess(index:number) {
    this.isOpenedAccess = index;
  }
  collapseAccess() {
    this.isOpenedAccess=0;
    this.addAccessForm.reset();
  }
  getAllLubricants(){
    this.stockServ.getAllLubricants().subscribe(Response=>{
     
      stockServ => this.lubricants = stockServ;
      this.lubricants=Response;
    },
    error=>{
      alert("error")
    });
  }
  getAllAccess(){
    this.stockServ.getAllAccess().subscribe(Response=>{
      stockServ => this.accessories = stockServ; this.accessories=Response;
    },
    error=>{
      alert("error")
    });
  }
  displayTables(selectedTab){
    if(selectedTab.index==1){
       var cc=$("#lubTable").DataTable();
       this.globalDataTable=cc;
    }
    if(selectedTab.index==2){
       var cc=$("#accessTable").DataTable();
       this.globalDataTable=cc;
    }
  }
  getAllFuelContainers(){
    this.stockServ.getAllFuelContainers().subscribe(Response=>{
      
      stockServ => this.fuelContainers = stockServ; this.fuelContainers=Response;
      console.log(this.fuelContainers);
    },
    error=>{
      alert("error")
    });
  }


 
  
}
