import { Component, OnInit } from '@angular/core';
import { MatSnackBar} from '@angular/material';
import { SellAccessoriesService } from './sell-accessories.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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
  shiftID:any;
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
    this.shiftID=localStorage.getItem("shiftID")  /*Get Employee ID */
    this.pageBtns=[];
    SellAccessoriesComponent.accForm = this.fb.group({
      shiftID: this.shiftID,
      type:'access',
      invoiceType: this.invoiceType,
      totalProfit: '',
      amountPaid:'',
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
    this.profit = totalPrice - (quantity*cost);
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
    }else if(this.debit == 'true'){
    SellAccessoriesComponent.accForm.get('totalProfit').setValue(this.profit);
    this.pageType="sellAccess";
      const item = this.fb.group({
        itemID:id,
        name:name,
        price:price,
        quantity:quantity,
        totalPrice:totalPrice,  
      });
      this.itemsForm.push(item);
      this.router.navigate(['/debbiting'], {queryParams:{pageType:this.pageType}});
    }
    else{
    SellAccessoriesComponent.accForm.get('totalProfit').setValue(this.profit);
    SellAccessoriesComponent.accForm.get('amountPaid').setValue(totalPrice);
    const item = this.fb.group({
        itemID:id,
        name:name,
        price:price,
        quantity:quantity, 
      });
      this.itemsForm.push(item);
      this.sellAccServ.addInvoice(SellAccessoriesComponent.accForm.value).subscribe(
      Response=>{
        this.openSnackBar(name, "تم البيع");
        this.getAccessories(this.itemPerPage,this.offset);
        SellAccessoriesComponent.accForm.reset();
        SellAccessoriesComponent.accForm.get('shiftID').setValue(this.shiftID);
        SellAccessoriesComponent.accForm.get('type').setValue('access');
        SellAccessoriesComponent.accForm.get('invoiceType').setValue(this.invoiceType);
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
    if(this.itemsForm.length != 0)
      this.router.navigate(['/debbiting'], {queryParams:{pageType:this.pageType}});
    else{
      swal({
        type: 'info',
        // title: 'تنبية',
        // text:',
        html:"<h4 style='color:#7a327a'>يجب تحديد منتج واحد على الأقل'</h4>",
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  get itemsForm() {
    return SellAccessoriesComponent.accForm.get('items') as FormArray
  }
  get totalProfit() {
    return SellAccessoriesComponent.accForm.get('totalProfit')
  }

}
