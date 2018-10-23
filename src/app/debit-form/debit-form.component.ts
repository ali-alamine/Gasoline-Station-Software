import { Component } from '@angular/core';
import { FormControl,FormGroup} from '@angular/forms';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { ActivatedRoute,Router } from '@angular/router';
import { DebitFormService} from  './debit-form.service'
import { MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-debit-form',
  templateUrl: './debit-form.component.html',
  styleUrls: ['./debit-form.component.scss']
})
export class DebitFormComponent {
  private urlData;
  debitData:any;
  clients:any;
  clientName:any;
  clientID:any;
  totalAmount:any;
  restAmount:any;
  debit_type:any;
  debitForm = new FormGroup({
    amountPaid: new FormControl(''),
    comment: new FormControl(''),
  });
  clientDebitData={
    "itemID":"",
    "empID":"",
    "name":"",
    "price":"",
    "quantity":"",
    "totalPrice":"",
    "type":"",
    "clientID":"",
    "amountRest":"",
    "comment":"",
    "invoiceType":''
  };
  person;
  constructor(private router: Router,private route: ActivatedRoute,private debitFormServ:DebitFormService,public snackBar: MatSnackBar){}
  ngOnInit(){
    // debugger
    this.urlData = this.route.queryParams.subscribe(params => {
      this.debitData = params|| -1; 
      // debugger
        this.person="Client Name"
        if(params.invoiceType == 'supply'){
          this.person="Supply Name"
          this.getClients(0);
          this.debitForm.get('amountPaid').setValue(params.totalPrice);
          this.getRemainingValue(params.totalPrice);
        } else{
          this.getClients(1);
        }
      if(params.type=="lub"){
        this.debit_type="lub";
      }else if(params.debitType=="washing"){
        this.debit_type="washing";
      }else if(params.debitType=="access"){
        this.debit_type="access";
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1700,
    });
  }


  getClients(isClient){
    this.debitFormServ.getAllClients(isClient).subscribe(Response=>{
      debitFormServ => this.clients = debitFormServ;
      this.clients=Response;
    },
    error=>{
      alert("error")
    });
  }
  sellLubOndebit(data){
    var redirect=0;
    this.clientDebitData={
      "itemID":this.debitData.itemID,
      "empID":this.debitData.empID,
      "name":this.debitData.name,
      "price":this.debitData.price,
      "quantity":this.debitData.quantity,
      "totalPrice":this.debitData.totalPrice,
      "type":this.debitData.type,
      "clientID":this.clientID,
      "amountRest":this.restAmount,
      "comment":data.comment,
      "invoiceType": this.debitData.invoiceType
    };
    this.debitFormServ.addInvoice(this.clientDebitData).subscribe(Response=>{
      
      /* notification message when sell sucess */
      this.openSnackBar(this.restAmount + " added to " +this.clientName+ " account", "Done" );

      /* wait 3 sec untrill notification disappear and navigate to operations */
      if(this.debitData.invoiceType=='supply'){
        // debugger
        setTimeout(()=>this.router.navigate(['/paymentSupply']),1800);
      }else
        setTimeout(()=>this.router.navigate(['/operations']),1800);

    },
    error=>{
      alert("error");
    });
  }
  sellWashServOnDebit(data){
    console.log(data)
    var empID= localStorage.getItem('userID');
    var debitWashData={"empID":empID,"clientID":this.clientID,"amountRest":this.restAmount,"comment":data.comment};
    this.debitFormServ.sellWashServOnDebit(debitWashData).subscribe(Response=>{
      
      /* notification message when sell sucess */
      this.openSnackBar(this.restAmount + " added to " +this.clientName+ " account", "Done" );

      /* wait 3 sec untrill notification disappear and navigate to operations */
      setTimeout(()=>this.router.navigate(['/operations']),1800);

    },
    error=>{
      alert("error");
    });
  }

  submitDebitFormData(data){
    alert(this.debit_type)
      switch(this.debit_type) { 
        case "lub": { 
          console.log(data)
          console.log("here we go")
          this. sellLubOndebit(data);
          break; 
        } 
        case "washing": {
          this.sellWashServOnDebit(data);
          break; 
        }
        default: { 
          break; 
        } 
    }
  }
    
  getSelectedClientData(data){
    // alert(data.full_name + " - " + data.PID)
    this.clientName=data.full_name;
    this.clientID=data.PID;
    // this.restAmount="1000";
   
    // console.log(this.clientDebitData)
  }

  getRemainingValue(amountPaid){
    if(this.debit_type=='lub'){
      this.restAmount=this.debitData.totalPrice-amountPaid;
    }else if(this.debit_type=="washing"){
      this.restAmount=amountPaid;
    }
    
  }

}
