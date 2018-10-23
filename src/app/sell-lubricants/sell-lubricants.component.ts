import { Component, OnInit } from '@angular/core';
import { SellLubricantsService} from  './sell-lubricants.service'
import { MatSnackBar} from '@angular/material';
import { ActivatedRoute,Router } from '@angular/router';
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
  empID:any;
  pageBtns:any;
  totalItems=0;
  itemPerPage:any=12;
  offset=0;
  debitType:any;
  urlData:any;
  backgroundColor="red";
  currentPage=1;
  invoiceType;
  private sellLubData={"itemID":"","empID":"","name":"","price":"","quantity":"","totalPrice":"","type":'lub',"isDebit":'',"rest":"","invoiceType":''};
  constructor(private sellLubServ:SellLubricantsService,public snackBar: MatSnackBar,private router: Router, private route: ActivatedRoute) { }
 
  ngOnInit() {
    this.urlData = this.route.queryParams.subscribe(params => {
      this.debitType = params['debitType'] || 0;
      this.invoiceType = params['invoiceType'] || -1;
    });
    this.getLubricant(this.itemPerPage,this.offset);
    this.empID=localStorage.getItem("userID")  /*Get Employee ID */
    this.pageBtns=[];
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
  sellLub(id,name,price,quantity,totalPrice){
    if(this.invoiceType == "supply"){
      var sellOndebit="1";
      this.sellLubData={"itemID":id,"empID":this.empID,"name":name,"price":price,"quantity":quantity,"totalPrice":totalPrice,"type":'lub','isDebit':sellOndebit,"rest":"0","invoiceType":this.invoiceType};
      this.router.navigate(['/debbiting'], { queryParams: this.sellLubData});
    }
    else if(this.debitType == "lub"){
      var sellOndebit="1";
      this.sellLubData={"itemID":id,"empID":this.empID,"name":name,"price":price,"quantity":quantity,"totalPrice":totalPrice,"type":'lub','isDebit':sellOndebit,"rest":"0","invoiceType":'sell'};
      this.router.navigate(['/debbiting'], { queryParams: this.sellLubData });
    }else{
      var sellOndebit="0";
      this.sellLubData={"itemID":id,"empID":this.empID,"name":name,"price":price,"quantity":quantity,"totalPrice":totalPrice,"type":'lub','isDebit':sellOndebit,"rest":"0","invoiceType":'sell'};
      this.sellLubServ.addInvoice(this.sellLubData).subscribe(
      Response=>{
        this.openSnackBar(name, "SOLD");
        this.getLubricant(this.itemPerPage,this.offset);
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
}
