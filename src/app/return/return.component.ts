import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { MatSnackBar} from '@angular/material';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ReturnService } from './return.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})
export class ReturnComponent implements OnInit {
  private urlData;
  debitData:any;
  clients:any;
  person;
  private debitForm: FormGroup;
  // isOpened = 0;
  // private personForm;
  modalReference: any;
  rest; paid;empID;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private returnServ:ReturnService,
    public snackBar: MatSnackBar,
    // private modalService: NgbModal,
    private fb: FormBuilder) { }

    ngOnInit(){
        this.empID = localStorage.getItem('userID');
      this.debitForm = this.fb.group({
        personID : [],
        personName: ['', Validators.required],
        debit: ['', Validators.required],
        paidDebit: ['', Validators.required],
        totalDebit: ['', Validators.required],
        comment: [''],
        // itemID:this.debitData.itemID,
        empID:this.empID,
        // name:this.debitData.name,
        // price:this.debitData.price,
        // quantity:this.debitData.quantity,
        // totalPrice:this.debitData.totalPrice,
        // type:this.debitData.type,
        // invoiceType: this.debitData.invoiceType,
        // isCash: this.debitData.isCash
      });
      this.getClients(1);
      this.onDebitAmountChange();
    }

    getClients(isClient){
      // debugger
      this.returnServ.getAllClients(isClient).subscribe(Response=>{
        this.clients=Response;
      },
      error=>{
        alert("error")
      });
    }
    onDebitAmountChange(): void {
      this.debitForm.get('paidDebit').valueChanges.subscribe(val => {
        var paidDebit = this.debitForm.get('paidDebit').value;
        var totalDebit = this.debitForm.get('totalDebit').value;
        if(paidDebit == '') paidDebit = 0;
        // console.log(paidDebit)
        // console.log(parseInt(paidDebit))
        this.debitForm.get('debit').setValue(parseInt(totalDebit) - paidDebit);
        
      })
    }
    getSelectedClientData(event, client){
      // debugger
      // if (event.source.selected) {
        this.debitForm.get('personID').setValue(client.PID);
        this.debitForm.get('debit').setValue(client.debitAmount);
        this.debitForm.get('totalDebit').setValue(client.debitAmount);
      // }
      console.log(this.debitForm.value)
    }
    submitDebit(){
      console.log(this.debitForm.value)
      this.returnServ.addReturnInvoice(this.debitForm.value).subscribe(
        Response=>{
        this.openSnackBar(this.debitForm.get('paidDebit').value + " return debit to " +this.debitForm.get('personName').value+ " account", "Done" );
        // this.openSnackBar(this.debitForm.get('paidDebit').value, "Return debit");
          setTimeout(()=>this.router.navigate(['/debits']),1000);
        },
        error=>{
          alert("error");
        });
    }
    /* show feed back message when sell succeed */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
    get paidDebit() {
      return this.debitForm.get('paidDebit');
    }
    get debit() {
      return this.debitForm.get('debit');
    }
}