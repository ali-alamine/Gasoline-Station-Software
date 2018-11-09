import { Component } from '@angular/core';
import { FormControl,FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { ActivatedRoute,Router } from '@angular/router';
import { DebitFormService} from  './debit-form.service'
import { MatSnackBar} from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellAccessoriesComponent } from '../sell-accessories/sell-accessories.component';

@Component({
  selector: 'app-debit-form',
  templateUrl: './debit-form.component.html',
  styleUrls: ['./debit-form.component.scss']
})
export class DebitFormComponent {
  private urlData;
  debitData :any;
  clients:any;
  person;
  private debitForm : FormGroup;
  private personForm;
  modalReference: any;
  rest; paid;
  private typePage;
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private debitFormServ:DebitFormService,
    public snackBar: MatSnackBar,
    private modalService: NgbModal,
    private fb: FormBuilder){}

  ngOnInit(){
    this.debitData =SellAccessoriesComponent.accForm.value;
    console.log(this.debitData)
    this.urlData = this.route.queryParams.subscribe(params => {
      this.typePage = params['pageType']|| -1; 
    });
    if(this.typePage == "supplyAccess"){
      this.debitForm = this.fb.group({
        empID: this.debitData.empID,
        type:this.debitData.type,
        invoiceType: this.debitData.invoiceType,
        personID : '',
        personName: ['', Validators.required],
        amountPaid: [0, Validators.required],
        amountRest: [0, Validators.required],
        comment: '',
        items: this.fb.array([])
      });
      this.debitData.items.forEach(element => {
        const item = this.fb.group({
          itemID:element['itemID'],
          name:element['name'],
          price:element['price'],
          totalProfit:element['totalProfit'],
          quantity:element['quantity'],
          totalPrice:element['totalPrice'],
          // isCash: [element['isCash']]      
        });
        this.itemsForm.push(item);
      });
    }else if(this.typePage == "sellAccess"){
      this.debitForm = this.fb.group({
        empID: this.debitData.empID,
        type:this.debitData.type,
        invoiceType: this.debitData.invoiceType,
        personID : '',
        personName: ['', Validators.required],
        amountPaid: [0, Validators.required],
        amountRest: [this.debitData.items[0].totalPrice, Validators.required],
        comment: '',
        items: this.fb.array([{
          itemID:this.debitData.items[0].itemID,
          name:this.debitData.items[0].name,
          price:this.debitData.items[0].price,
          totalProfit:this.debitData.items[0].totalProfit,
          quantity:this.debitData.items[0].quantity,
          totalPrice:this.debitData.items[0].totalPrice,
          // isCash: [SellAccessoriesComponent.accForm[0].value.isCash]      
        }])
      });
    }
    console.log(this.debitForm.value)
    this.onDebitAmountChange();
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
    this.debitFormServ.addPerson(this.personForm.value).subscribe(Response=>{
      if(this.debitForm.get('invoiceType').value == 'supply')
        this.getClients(0)
      else
        this.getClients(1);
      this.debitForm.get('personName').setValue(this.personForm.get('name').value);
      this.debitForm.get('personID').setValue(Response);
      this.modalReference.close();
      },
    error=>{
      console.log("error: "+error);
    });

  }
  submitDebitFormData(){
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
  get itemsForm() {
    return this.debitForm.get('items') as FormArray
  }

}
