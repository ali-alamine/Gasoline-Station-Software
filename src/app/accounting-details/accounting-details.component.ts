import { Component, OnInit } from '@angular/core';
import { AccountingComponent } from '../accounting/accounting.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountingService } from '../accounting/accounting.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-accounting-details',
  templateUrl: './accounting-details.component.html',
  styleUrls: ['./accounting-details.component.scss']
})
export class AccountingDetailsComponent implements OnInit {
  private urlData;
  type;
  empID;shiftID;
  totalAmount = 0;
  totalProfit = 0;
  details;
  isDebit;
  isOpened = 0;
  empType;
  selectedDetails = new Array();
  shiftIDs;
  constructor(private router: Router, private route: ActivatedRoute,private accountingService:AccountingService) { }

  ngOnInit() {
    this.urlData = this.route.queryParams.subscribe(params => {
      this.type = params['type'] || -1;
    });
    this.empID=localStorage.getItem('userID');
    this.shiftID=localStorage.getItem('shiftID');
    // alert(this.type)
    this.empType=localStorage.getItem('activeUser');
    this.shiftIDs=localStorage.getItem('shiftIDs');
    // this.getDetailInvoice();
    this.shiftIDs=this.shiftIDs.split(',');
    // console.log(this.shiftIDs);
    this.details=AccountingComponent.details;
    console.log("-------")
    console.log(this.details)
    console.log("-------")
    this.getDetailInvoice();
  }
  getDetailInvoice(){
    this.totalProfit= 0;
    this.totalAmount= 0;
    this.selectedDetails= [];
    if(this.type == 'debits'){
      this.details.forEach(element => {
        this.totalAmount = this.totalAmount + parseInt(element['rest']);
      });
    } else if (this.type == 'access' || this.type == 'lub' || this.type == 'supply' || this.type == 'wash' ){
      this.details.forEach(element => {
        this.totalProfit = this.totalProfit + parseInt(element['profit']);
        this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
      });
    } else if (this.type == 'payC' || this.type == 'return'){
      this.details.forEach(element => {
        this.totalAmount = this.totalAmount + parseInt(element['amount']);
      });
    
    } else if (this.type == 'allType'){
      this.details.forEach(element => {
        if(element['type'] == 'access' || element['type'] == 'lub' || element['type'] == 'wash' 
        || element['type'] == 'dieselG_d' || element['type'] == 'dieselR_d' || element['type'] == '95_d'|| element['type'] == '98_d' ){
          this.totalProfit = this.totalProfit + parseInt(element['profit']);
          this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
        }else if(element['type'] == 'return' || element['type'] == 'payC' || 
        element['type'] == 'Diesel G' || element['type'] == 'Diesel R' || element['type'] == '95'|| element['type'] == '98'){
          this.totalAmount = this.totalAmount + parseInt(element['amount']);
        }
      });
    } else if(this.type == 'counters'){
      this.details.forEach(element => {
        if(element['type'] == 'dieselG_d' || element['type'] == 'dieselR_d' || element['type'] == '95_d'|| element['type'] == '98_d' ){
          this.totalAmount = this.totalAmount + (parseInt(element['amount']) - parseInt(element['rest']));
        }else if(element['type'] == 'Diesel G' || element['type'] == 'Diesel R' || element['type'] == '95'|| element['type'] == '98'){
          this.totalProfit = this.totalProfit + parseInt(element['profit']);
          this.totalAmount = this.totalAmount + parseInt(element['amount']);
        }
      });
    }
    this.details.forEach(element => {
        this.selectedDetails.push(element);
    });
  }
  togglePanel(index:number) {
    this.isOpened = index;
  }
  deleteInvoice(i,id,date,type,isSupply,amount,rest,PID,note,fuel_liters,shiftID) {
    let data = {'invID':id,'type':type,'isSupply':isSupply,'amount':amount,
    'rest':rest,'PID':PID,'note':note,'fuel_liters':fuel_liters,'shiftID':shiftID};
    console.log(data)
    // let now = new Date();
    // let invoiceDate = new Date(date);
    // now.setHours(0,0,0,0);
    // invoiceDate.setHours(0,0,0,0);
    // if (now.getTime() === invoiceDate.getTime()) {
      // debugger
      // swal({
      //   title:'الغاء', 
      //   html: " هل تريد الغاء الفاتورة ؟<br> لا يمكنك استرجاع الفاتورة بعد الغائها",
      //   type: 'warning',
      //   showCancelButton: true,
      //   confirmButtonColor: '#d33',
      //   cancelButtonColor: '#3085d6',
      //   confirmButtonText: 'نعم !',
      //   cancelButtonText: 'كلا',     
      // }).then((result) => {
      //   if (result.value) {
          this.accountingService.deleteInvoice(data).subscribe(Response => {
            // this.details.removeAt(i);
            // this.getDetailInvoice();
            this.router.navigate(["/account"]);
            Swal({
              type: 'success',
              title: 'الغاء فاتورة',
              text:'تم الغاء الفاتورة و تعديل المخزن',
              showConfirmButton: false,
              timer: 1000
            });     
        }, error => {
            Swal({
              type: 'error',
              title: error.statusText,
              text:error.message
            });
          });
        // }
      // });
    // } else {
    //   swal({
    //     type: 'info',
    //     title: "لا يمكنك الغاء هذه الفاتورة",
    //     text: "يمكنك فقط الغاء فواتير اليوم",
    //     confirmButtonText: "حسنا"
    //   });
    //   return;
    // }

  }
}
