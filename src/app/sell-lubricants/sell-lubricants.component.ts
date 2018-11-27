import { Component, OnInit } from '@angular/core';
import { SellLubricantsService} from  './sell-lubricants.service'
import { MatSnackBar} from '@angular/material';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
export interface Page<pageBtns>{
  color: string;
  text: string;
}
@Component({
  selector: 'app-sell-lubricants',
  templateUrl: './sell-lubricants.component.html',
  styleUrls: ['./sell-lubricants.component.scss']
})
export class SellLubricantsComponent implements OnInit {
  lubricants:any;
  selectedLubQuan:any;
  shiftID:any;
  pageBtns:any;
  totalItems=0;
  itemPerPage:any=12;
  offset=0;
  debit:any;
  urlData:any;
  currentPage=1;
  invoiceType;
  profit;
  pageType;
  static lubForm: FormGroup;

  constructor(private sellLubServ:SellLubricantsService,public snackBar: MatSnackBar,
    private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder) { }
 
  ngOnInit() {
    this.urlData = this.route.queryParams.subscribe(params => {
      this.debit = params['debit'] || false;
      this.invoiceType = params['invoiceType'] || -1;
    });
    this.getLubricant(this.itemPerPage,this.offset);
    this.shiftID=localStorage.getItem("shiftID")  /*Get shift ID */
    this.pageBtns=[];
    SellLubricantsComponent.lubForm = this.fb.group({
      shiftID: this.shiftID,
      type:'lub',
      invoiceType: this.invoiceType,
      totalProfit: '',
      amountPaid:'',
      items: this.fb.array([]),
    });
  }
  getLubricant(limit,offset){
    this.itemPerPage=localStorage.getItem("ipp");
    // console.log(this.itemPerPage)
    if(this.itemPerPage == null){
      localStorage.setItem("ipp",'12');
      this.itemPerPage = 12;
    }

    this.sellLubServ.getLubricant(limit,offset).subscribe(Response=>{
      sellLubServ => this.lubricants = sellLubServ;
      this.lubricants=Response[0];
      this.totalItems=Response[1][0]['total'];

       /* Get the number of pages and round up if not integer*/ 
      var numberOfButtons= Math.ceil(this.totalItems/this.itemPerPage);
      
      /* prevent regeneration of pages buttons */
      if(this.pageBtns.length == 0){
        /* Generate buttons to display pages content */
        for(var i=1; i<=numberOfButtons;i++){
            this.pageBtns.push({"color":"red","text":i})
        }
      }
      /* set default quantity to 1 and default total price as defined  */
      for(var i=0; i<this.lubricants.length;i++){
        this.lubricants[i]['defaultQuan']=1;
        this.lubricants[i]['totalPrice']=this.lubricants[i].selling_price;
      }
    },
    error=>{
      alert("error")
    });
  }
  getSelectedPage(pageIndex){
    this.offset=pageIndex*this.itemPerPage;
    this.getLubricant(this.itemPerPage,this.offset);

    let selectedPageIndex = document.getElementsByClassName('pageIndex');
    /* turn on - turn off selected tiles  */
    for(var i=0;i<this.pageBtns.length;i++){
      if(selectedPageIndex[i].classList.contains('activePageIndex')){
        selectedPageIndex[i].classList.remove('activePageIndex');
        break;
      }
    }
    selectedPageIndex[pageIndex].classList.add('activePageIndex');
  }
  /* Get Quantity of sold lubricants */
  getQuantity(quantity,index){
    this.lubricants[index]['defaultQuan'] =quantity;
    this.lubricants[index].totalPrice=this.lubricants[index].selling_price*this.lubricants[index].defaultQuan;
  }
  /* increment the price of lubricant  */
  incPrice(defaultPrice,index){
    /*stopPropagation() - to prevent firing outer div functon when click on the inner div */
    window.event.stopPropagation();
    var price =parseInt(this.lubricants[index]['totalPrice'])
    price +=500;
    this.lubricants[index]['totalPrice']=price;

  }
  /* decrement the price of lubricant  */
  decPrice(defaultPrice,index){
    window.event.stopPropagation();
    var price =parseInt(this.lubricants[index]['totalPrice'])
    price -=500;
    this.lubricants[index]['totalPrice']=price;
  }
  /* show feed back message when sell succeed */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  /* sell lubricant */
  sellLub(id,name,price,cost,quantity,totalPrice){
    
    this.profit = totalPrice - (quantity * cost);
    if(this.invoiceType == "supply"){
      const item = this.fb.group({
        itemID:id,
        name:name,
        price:0,
        quantity:quantity,
        totalPrice:0,  
      });
      this.itemsForm.push(item);
      this.openSnackBar(name, "Add Supply");
    }
    else if(this.debit == 'true'){
      SellLubricantsComponent.lubForm.get('totalProfit').setValue(this.profit);
      this.pageType="sellLub";
        const item = this.fb.group({
          itemID:id,
          name:name,
          price:price,
          quantity:quantity,
          totalPrice:totalPrice,  
        });
        this.itemsForm.push(item);
        this.router.navigate(['/debbiting'], {queryParams:{pageType:this.pageType}});
    }else{
      SellLubricantsComponent.lubForm.get('totalProfit').setValue(this.profit);
      SellLubricantsComponent.lubForm.get('amountPaid').setValue(totalPrice);
      const item = this.fb.group({
        itemID:id,
        name:name,
        price:price,
        quantity:quantity  
      });
      this.itemsForm.push(item);
      // console.log(SellLubricantsComponent.lubForm.value)
      this.sellLubServ.addInvoice(SellLubricantsComponent.lubForm.value).subscribe(
      Response=>{
        this.openSnackBar(name, "تم البيع");
        this.getLubricant(this.itemPerPage,this.offset);
        SellLubricantsComponent.lubForm.reset();
        SellLubricantsComponent.lubForm.get('shiftID').setValue(this.shiftID);
        SellLubricantsComponent.lubForm.get('type').setValue('lub');
        SellLubricantsComponent.lubForm.get('invoiceType').setValue(this.invoiceType);
        while (this.itemsForm.length !== 0) {
          this.itemsForm.removeAt(0)
        }
          setTimeout(()=>this.router.navigate(['/operations']),1000);
      },
      error=>{
        alert("error");
      });
    }
  }
  /* highlight the selected tile */
  heightLightSelectedTile(index){
      let selectedLub = document.getElementsByClassName('tile-grid');
      /* turn on - turn off selected tiles  */
      for(var i=0;i<this.lubricants.length;i++){
        if(selectedLub[i].classList.contains('selectedTile')){
          selectedLub[i].classList.remove('selectedTile');
          break;
        }
      }
      selectedLub[index].classList.add('selectedTile');
  }
  /*detect how many items will be shown in single page */
  setItemPerPage(ipp){
    localStorage.setItem("ipp",ipp);
    this.pageBtns=[];
    this.getLubricant(ipp,this.offset);
  }
  sellLubRouter(){
    this.pageType = 'supplyLub';
    if(this.itemsForm.length != 0)
      this.router.navigate(['/debbiting'], {queryParams:{pageType:this.pageType}});
    else{
      swal({
        type: 'error',
        title: 'تنبية',
        text:'يجب تحديد منتج واحد على الأقل',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  get itemsForm() {
    return SellLubricantsComponent.lubForm.get('items') as FormArray
  }
  get totalProfit() {
    return SellLubricantsComponent.lubForm.get('totalProfit')
  }
}
