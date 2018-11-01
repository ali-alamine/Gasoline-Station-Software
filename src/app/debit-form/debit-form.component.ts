import { Component } from '@angular/core';
import { FormControl,FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { ActivatedRoute,Router } from '@angular/router';
import { DebitFormService} from  './debit-form.service'
import { MatSnackBar} from '@angular/material';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-debit-form',
  templateUrl: './debit-form.component.html',
  styleUrls: ['./debit-form.component.scss']
})
export class DebitFormComponent {
  private urlData;
  debitData:any;
  clients:any;
  person;
  private debitForm: FormGroup;
  private personForm;
  modalReference: any;
  rest; paid;
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private debitFormServ:DebitFormService,
    public snackBar: MatSnackBar,
    private modalService: NgbModal,
    private fb: FormBuilder){}

  ngOnInit(){
    
    this.urlData = this.route.queryParams.subscribe(params => {
      this.debitData = params|| -1; 
      if(this.debitData != -1){
        if(this.debitData.invoiceType == 'supply'){
          this.person="Supply Name"
          this.getClients(0);
          this.rest = 0;
          this.paid = this.debitData.totalPrice;
        } else{
          this.getClients(1);
          this.person="Client";
          this.paid = 0;
          this.rest = this.debitData.totalPrice;
        } 
        this.debitForm = this.fb.group({
          personID : [],
          personName: ['', Validators.required],
          amountPaid: [this.paid, Validators.required],
          amountRest: [this.rest, Validators.required],
          comment: [''],
          itemID:this.debitData.itemID,
          empID:this.debitData.empID,
          name:this.debitData.name,
          price:this.debitData.price,
          totalProfit:this.debitData.totalProfit,
          quantity:this.debitData.quantity,
          totalPrice:this.debitData.totalPrice,
          type:this.debitData.type,
          invoiceType: this.debitData.invoiceType,
          isCash: this.debitData.isCash
        });
      }
      this.onDebitAmountChange();
    });
  }
  openPersonModal(personModal) {
    this.modalReference = this.modalService.open(personModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var isClient= 1;
    if(this.debitForm.get('invoiceType').value == "supply"){
      isClient = 0;
    }
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      isClient: isClient
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
  addPerson(){
    console.log(this.personForm.value)
    this.debitFormServ.addPerson(this.personForm.value).subscribe(Response=>{
      if(this.debitForm.get('invoiceType').value == 'supply')
        this.getClients(0)
      else
        this.getClients(1);
      this.debitForm.get('personName').setValue(this.personForm.get('name').value);
      this.debitForm.get('personID').setValue(Response);
      // document.getElementById("delDate").focus();
      console.log(this.debitForm.value)
      this.modalReference.close();
      },
    error=>{
      console.log("error: "+error);
    });

  }
  submitDebitFormData(){
    console.log(this.debitForm.value)
    // sellWashService
    if(this.debitForm.get('type').value == 'wash')
    {
      this.debitFormServ.sellWashServOnDebit(this.debitForm.value).subscribe(Response=>{

        /* notification message when sell sucess */
        this.openSnackBar(this.debitForm.get('amountRest').value + " added to " +this.debitForm.get('personName').value+ " account", "Done" );
  
        /* wait 3 sec untrill notification disappear and navigate to operations */
        if(this.debitForm.get('invoiceType').value == 'supply'){
          setTimeout(()=>this.router.navigate(['/paymentSupply']),1000);
        }else
          setTimeout(()=>this.router.navigate(['/operations']),1000);
  
      },
      error=>{
        console.log("error: "+error);
      });
    } else{

      this.debitFormServ.addInvoice(this.debitForm.value).subscribe(Response=>{
  
        /* notification message when sell sucess */
        this.openSnackBar(this.debitForm.get('amountRest').value + " added to " +this.debitForm.get('personName').value+ " account", "Done" );
  
        /* wait 3 sec untrill notification disappear and navigate to operations */
        if(this.debitForm.get('invoiceType').value == 'supply'){
          setTimeout(()=>this.router.navigate(['/paymentSupply']),1000);
        }else
          setTimeout(()=>this.router.navigate(['/operations']),1000);
  
      },
      error=>{
        console.log("error: "+error);
      });
    }
  }

  getSelectedClientData(id){
    this.debitForm.get('personID').setValue(id);
  }
  onDebitAmountChange(): void {
    this.debitForm.get('amountPaid').valueChanges.subscribe(val => {
      var amountPaid = this.debitForm.get('amountPaid').value;
      var totalPrice = this.debitForm.get('totalPrice').value;
        if(amountPaid == '') amountPaid = 0;
        this.debitForm.get('amountRest').setValue(parseInt(totalPrice) - amountPaid);
      
    })
  }

  get personName() {
    return this.debitForm.get('personName');
  }
  get type() {
    return this.debitForm.get('type');
  }
  get totalPrice() {
    return this.debitForm.get('totalPrice');
  }
  get amoundPaid() {
    return this.debitForm.get('amoundPaid');
  }
  get amountRest() {
    return this.debitForm.get('amountRest');
  }
  get invoiceType() {
    return this.debitForm.get('invoiceType');
  }

}
