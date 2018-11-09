import { Component, OnInit } from '@angular/core';
import { MatSnackBar} from '@angular/material';
import { SellAccessoriesService } from './sell-accessories.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '../../../node_modules/@angular/forms';
export interface Page<pageBtns>{
  color: string;
  text: string;
}
@Component({
  selector: 'app-sell-accessories',
  templateUrl: './sell-accessories.component.html',
  styleUrls: ['./sell-accessories.component.scss']
})
export class SellAccessoriesComponent implements OnInit {
  accessories:any;
  selectedLubQuan:any;
  empID:any;
  pageBtns:any;
  totalItems=0;
  itemPerPage:any=12;
  offset=0;
  currentPage=1;
  urlData:any;
  invoiceType;
  debit;
  profit;
  pageType;

  static accForm: FormGroup;

    
  constructor(private sellAccServ:SellAccessoriesService,public snackBar: MatSnackBar,
    private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder) { }
 
  ngOnInit() {
    this.urlData = this.route.queryParams.subscribe(params => {
      this.debit = params['debit'] || false;
      this.invoiceType = params['invoiceType'] || -1;
    });
    this.getAccessories(this.itemPerPage,this.offset);
    this.empID=localStorage.getItem("userID")  /*Get Employee ID */
    this.pageBtns=[];
    SellAccessoriesComponent.accForm = this.fb.group({
      empID: this.empID,
      type:'access',
      invoiceType: this.invoiceType,
      items: this.fb.array([]),

    });
  }
  getAccessories(limit,offset){
    this.itemPerPage=localStorage.getItem("ipp");
    // if(this.itemPerPage == null){
    //   localStorage.setItem("ipp",'12');
    //   this.itemPerPage = 12;
    // }
    this.sellAccServ.getAccessories(limit,offset).subscribe(Response=>{
      sellAccServ => this.accessories = sellAccServ;
      this.accessories=Response[0];
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
      for(var i=0; i<this.accessories.length;i++){
        this.accessories[i]['defaultQuan']=1;
        this.accessories[i]['totalPrice']=this.accessories[i].selling_price;
      }
    },
    error=>{
      alert("error")
    });
  }

  getSelectedPage(pageIndex){
    this.offset=pageIndex*this.itemPerPage;
    this.getAccessories(this.itemPerPage,this.offset);

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

  /* Get Quantity of sold accessories */
  getQuantity(quantity,index){
    this.accessories[index]['defaultQuan'] =quantity;
    this.accessories[index].totalPrice=this.accessories[index].selling_price*this.accessories[index].defaultQuan;

  }
  /* increment the price of lubricant  */
  incPrice(defaultPrice,index){
    /*stopPropagation() - to prevent firing outer div functon when click on the inner div */
    window.event.stopPropagation();
    var price =parseInt(this.accessories[index]['totalPrice'])
    price +=500;
    this.accessories[index]['totalPrice']=price;

  }
  /* decrement the price of lubricant  */
  decPrice(defaultPrice,index){
    window.event.stopPropagation();
    var price =parseInt(this.accessories[index]['totalPrice'])
    price -=500;
    this.accessories[index]['totalPrice']=price;
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  sellAcc(id,name,price,cost,quantity,totalPrice){
    // console.log(totalPrice)
    // console.log(price)
    this.profit = totalPrice - (quantity*cost);
    // console.log(this.profit)
    if(this.invoiceType == "supply"){
      const item = this.fb.group({
        itemID:id,
        name:name,
        price:price,
        totalProfit:'0',
        quantity:quantity,
        totalPrice:totalPrice,  
      });
      this.itemsForm.push(item);
      // this.router.navigate(['/debbiting'], { queryParams: this.accForm});
    }else if(this.debit == 'true'){
      // debugger
      this.pageType="sellAccess";
      const item = this.fb.group({
        itemID:id,
        name:name,
        price:price,
        totalProfit:'0',
        quantity:quantity,
        totalPrice:totalPrice,  
      });
      this.itemsForm.push(item);
      this.router.navigate(['/debbiting'], {queryParams:{pageType:this.pageType}});
      // this.router.navigate(['/debbiting'], { queryParams: this.pageType });
    }
    else{
      const item = this.fb.group({
        itemID:id,
        name:name,
        price:price,
        totalProfit:'0',
        quantity:quantity,
        totalPrice:totalPrice,  
      });
      this.itemsForm.push(item);
      this.sellAccServ.addInvoice(SellAccessoriesComponent.accForm).subscribe(
      Response=>{
        this.openSnackBar(name, "SOLD");
        this.getAccessories(this.itemPerPage,this.offset);
  
      },
      error=>{
        alert("error");
      });
    }
  }
  heightLightSelectedTile(index){
      let selectedLub = document.getElementsByClassName('tile-grid');
      /* turn on - turn off selected tiles  */
      for(var i=0;i<this.accessories.length;i++){
        if(selectedLub[i].classList.contains('selectedTile')){
          selectedLub[i].classList.remove('selectedTile');
          break;
        }
      }
      selectedLub[index].classList.add('selectedTile');
  }
  setItemPerPage(ipp){
    localStorage.setItem("ipp",ipp);
    this.pageBtns=[];
    this.getAccessories(ipp,this.offset);
  }
  sellAccRouter(){
    this.pageType = 'supplyAccess';
    console.log(SellAccessoriesComponent.accForm.value)
      this.router.navigate(['/debbiting'], {queryParams:{pageType:this.pageType}});
  }
  get itemsForm() {
    return SellAccessoriesComponent.accForm.get('items') as FormArray
  }

}
