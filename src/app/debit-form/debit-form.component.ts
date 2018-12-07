import { Component } from '@angular/core';
import { FormControl,FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { ActivatedRoute,Router } from '@angular/router';
import { DebitFormService} from  './debit-form.service'
import { MatSnackBar} from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellAccessoriesComponent } from '../sell-accessories/sell-accessories.component';
import { WashingCarComponent } from '../washing-car/washing-car.component';
import { SellLubricantsComponent } from '../sell-lubricants/sell-lubricants.component';
import swal from 'sweetalert2';
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
  public debitForm : FormGroup;
  public personForm;
  modalReference: any;
  rest; paid;
  public typePage;
  items:any;
  

  constructor(private router: Router,
    private route: ActivatedRoute,
    private debitFormServ:DebitFormService,
    public snackBar: MatSnackBar,
    private modalService: NgbModal,
    private fb: FormBuilder){}

  ngOnInit(){
    this.urlData = this.route.queryParams.subscribe(params => {
      this.typePage = params['pageType']|| -1; 
    });

    if(this.typePage == "supplyAccess" || this.typePage == 'sellAccess')
      this.debitData =SellAccessoriesComponent.accForm.value;
    else if(this.typePage == 'supplyLub' || this.typePage == "sellLub")
      this.debitData =SellLubricantsComponent.lubForm.value;
    
    if(this.typePage == "supplyAccess" || this.typePage == 'supplyLub'){
      this.debitForm = this.fb.group({
        shiftID: this.debitData.shiftID,
        type:this.debitData.type,
        invoiceType: this.debitData.invoiceType,
        totalProfit: 0,
        personID : ['', Validators.required],
        personName: ['', Validators.required],
        amountPaid: [0, Validators.required],
        amountRest: [0, Validators.required],
        comment: '',
        items:this.fb.array([])
      });
      this.debitData.items.forEach(element => {
        const item = this.fb.group({
          itemID:[element['itemID'], Validators.required],
          name:[element['name'], Validators.required],
          quantity:[element['quantity'], Validators.required],
          price:[element['price'], [Validators.required, Validators.min(1)]],
          totalPrice:[element['totalPrice'], [Validators.required, Validators.min(1)]],    
        });
        this.itemsForm.push(item);
      });
      this.person="المورد"
      this.getClients(0);
    }else if(this.typePage == "sellAccess" || this.typePage == "sellLub"){
      this.debitForm = this.fb.group({
        shiftID: this.debitData.shiftID,
        type:this.debitData.type,
        invoiceType: this.debitData.invoiceType,
        totalProfit: this.debitData.totalProfit,
        personID : ['', Validators.required],
        personName: ['', Validators.required],
        amountPaid: [0, Validators.required],
        amountRest: [this.debitData.items[0].totalPrice, Validators.required],
        comment: '',
        items: this.fb.array([{
          itemID:this.debitData.items[0].itemID,
          name:this.debitData.items[0].name,
          quantity:this.debitData.items[0].quantity,
          price:this.debitData.items[0].price,
          totalPrice:this.debitData.items[0].totalPrice,      
        }])
      });
      this.person="الزبون"
      this.getClients(1);
    }else if(this.typePage == "sellWash" ){
      this.debitData = WashingCarComponent.washForm.value;
      this.debitForm = this.fb.group({
        shiftID: this.debitData.shiftID,
        type:this.debitData.type,
        invoiceType: this.debitData.invoiceType,
        personID : ['', Validators.required],
        personName: ['', Validators.required],
        amountPaid: [0, Validators.required],
        amountRest: [this.debitData.totalPrice, Validators.required],
        comment: '',
        totalPrice:[this.debitData.totalPrice],      
        nameCar:this.debitData.nameCar,
      });
      this.person="الزبون"
      this.getClients(1);
    }else if(this.typePage == "sellFuelDebit"){
      var shiftID=localStorage.getItem('shiftID');
      this.debitForm = this.fb.group({
        shiftID: shiftID,
        type:['', Validators.required],
        invoiceType: 'sellFuelDebit',
        personID : ['', Validators.required],
        personName: ['', Validators.required],
        totalPrice:[0, [Validators.required, Validators.min(1)]],
        amountPaid: [0, Validators.required],
        amountRest: [0, Validators.required],
        comment: ''
      });
      this.person="الزبون"
      this.getClients(1);
    }
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
    let data = {'isClient':isClient}
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
    if(this.typePage == "sellWash")
    {
      this.debitFormServ.sellWashServOnDebit(this.debitForm.value).subscribe(Response=>{

        /* notification message when sell sucess */
        this.openSnackBar(this.debitForm.get('amountRest').value + " added to " +this.debitForm.get('personName').value+ " account", "منته" );
  
        /* wait 3 sec untrill notification disappear and navigate to operations */
        if(this.debitForm.get('invoiceType').value == 'supply'){
          setTimeout(()=>this.router.navigate(['/paymentSupply']),1000);
        }else
          setTimeout(()=>this.router.navigate(['/operations']),1000);
        this.debitForm.reset();
        // while (this.itemsForm.length !== 0) {
        //   this.itemsForm.removeAt(0)
        // }
      },
      error=>{
        console.log("error: "+error);
      });
    }else if(this.typePage == "sellFuelDebit"){
      this.debitFormServ.sellFuelOnDebit(this.debitForm.value).subscribe(Response=>{

        /* notification message when sell sucess */
        this.openSnackBar(this.debitForm.get('amountRest').value + " added to " +this.debitForm.get('personName').value+ " account", "منته" );
  
        /* wait 3 sec untrill notification disappear and navigate to operations */
          setTimeout(()=>this.router.navigate(['/operations']),1000);
          this.debitForm.reset();
      },
      error=>{
        console.log("error: "+error);
      });
    }else if(this.typePage == "sellLub" || this.typePage == 'sellAccess'){
      this.debitFormServ.addInvoice(this.debitForm.value).subscribe(Response=>{
        /* notification message when sell sucess */
        this.openSnackBar(this.debitForm.get('amountRest').value + " added to " +this.debitForm.get('personName').value+ " account", "منته" );
        /* wait 3 sec untrill notification disappear and navigate to operations */
        // if(this.debitForm.get('invoiceType').value == 'supply'){
        //   setTimeout(()=>this.router.navigate(['/paymentSupply']),1000);
        // }else
          setTimeout(()=>this.router.navigate(['/operations']),1000);
        this.debitForm.reset();
        // while (this.itemsForm.length !== 0) {
        //   this.itemsForm.removeAt(0)
        // }
      },
      error=>{
        console.log("error: "+error);
      });
    }else if(this.typePage == "supplyLub" || this.typePage == 'supplyAccess'){
      if(this.itemsForm.length != 0){
        this.debitFormServ.addInvoice(this.debitForm.value).subscribe(Response=>{
          /* notification message when sell sucess */
          this.openSnackBar(this.debitForm.get('amountRest').value + " added to " +this.debitForm.get('personName').value+ " account", "Done" );
          /* wait 3 sec untrill notification disappear and navigate to operations */
          if(this.debitForm.get('invoiceType').value == 'supply'){
            setTimeout(()=>this.router.navigate(['/paymentSupply']),1000);
          }else
            setTimeout(()=>this.router.navigate(['/operations']),1000);
          this.debitForm.reset();
          while (this.itemsForm.length !== 0) {
            this.itemsForm.removeAt(0)
          }
        },
        error=>{
          console.log("error: "+error);
        });
      }else{
        
        var msg = "<h4>Contact your software developer</h4>";
        swal({
            type: 'error',
            title: "تنبيه",
            html: msg,
            showCancelButton: true,
            // confirmButtonColor: 'purple',
            cancelButtonColor: 'gray',
            // confirmButtonText: 'Continue',
            cancelButtonText: 'ok',
        })
      }
    }
  }

  getSelectedClientData(event,person){
    if (event.source.selected) {
      this.debitForm.get('personID').setValue(person.PID);
    }
  }
  changeAmountPaid(){
      var amountPaid = this.debitForm.get('amountPaid').value;
      var total=0;
      if(this.typePage == "supplyAccess" || this.typePage == 'supplyLub'){
        for (var i = 0; i < this.itemsForm.controls.length; i++) {
          var totalPrice = this.itemsForm.controls[i].get('totalPrice').value;
          total = total + totalPrice;
        }
      }else if(this.typePage == "sellWash" || this.typePage == 'sellFuelDebit'){
        total = this.debitForm.get('totalPrice').value;      
      } else{
        total = this.debitForm.value.items[0].totalPrice;
      }
      if(amountPaid == '') amountPaid = 0;
      this.debitForm.get('amountRest').setValue(total - amountPaid);
  }
  changeTotalPrice(){
    var totalPrice = this.debitForm.get('totalPrice').value;
    var amountPaid = this.debitForm.get('amountPaid').value;
    this.debitForm.get('amountRest').setValue(totalPrice-amountPaid);
  }
  rowChangePrice(index){
    var total=0;
    for (var i = 0; i < this.itemsForm.controls.length; i++) {
      var price = this.itemsForm.controls[i].get('price').value;
      var itemTotalPrice=(this.itemsForm.controls[i].get('price').value)*(this.itemsForm.controls[i].get('quantity').value);
      this.itemsForm.controls[i].get('totalPrice').setValue(itemTotalPrice);
      total = total + itemTotalPrice;
    }
    this.debitForm.get('amountPaid').setValue(total);
    // this.debitForm.get('amountRest').setValue(0);
  }
  deleteItem(i,editPrice) {
    this.itemsForm.removeAt(i);
      this.rowChangePrice(i);
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
