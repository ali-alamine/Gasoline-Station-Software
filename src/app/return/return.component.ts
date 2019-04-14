import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { MatSnackBar} from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  empID:any;
  person;
  public debitForm: FormGroup;
  // isOpened = 0;
  // private personForm;
  modalReference: any;
  rest; paid;shiftID;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private returnServ:ReturnService,
    public snackBar: MatSnackBar,
    private fb: FormBuilder) { }

    ngOnInit(){
      this.empID=localStorage.getItem("userID");
        this.shiftID = localStorage.getItem('shiftID');
      this.debitForm = this.fb.group({
        personID : [],
        empID : this.empID,
        personName: ['', Validators.required],
        debit: ['', Validators.required],
        paidDebit: ['', [Validators.required, Validators.min(1)]],
        totalDebit: ['', Validators.required],
        comment: [''],
        shiftID:this.shiftID
      });
      // this.getClients(1);
      this.onDebitAmountChange();

      this.onClientNameChange();
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
    onClientNameChange(): void {
      this.debitForm.get('personName').valueChanges.subscribe(val => {
        
        var data = this.debitForm.get('personName').value;
        if (data == "") {
          this.clients = [];
          // this.debitForm.get('personName').setValue('')
          return;
        }
        this.returnServ.searchClient(data).subscribe(Response => {
          this.clients = Response;
        })
      });    
    }
    getSelectedClientData(event, client){
      if (event.source.selected) {
        this.debitForm.get('personID').setValue(client.PID);
        this.debitForm.get('debit').setValue(client.debitAmount);
        this.debitForm.get('totalDebit').setValue(client.debitAmount);
      }
    }
    submitDebit(){
      this.returnServ.addReturnInvoice(this.debitForm.value).subscribe(
        Response=>{
        this.openSnackBar(this.debitForm.get('paidDebit').value + " return debit to " +this.debitForm.get('personName').value+ " account", "منته" );
        // this.openSnackBar(this.debitForm.get('paidDebit').value, "Return debit");
          setTimeout(()=>this.router.navigate(['/operations']),1000);
        this.debitForm.reset();
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
  clearClientName(){
    
  }
    get paidDebit() {
      return this.debitForm.get('paidDebit');
    }
    get debit() {
      return this.debitForm.get('debit');
    }
}
