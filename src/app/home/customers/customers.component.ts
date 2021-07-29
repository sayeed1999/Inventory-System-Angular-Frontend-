import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from 'src/app/models/Customer.model';
import { ServiceResponse } from 'src/app/models/ServiceResponse.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Name', 'Address', 'Contact', 'Edit', 'Remove'];
  dataSource: Customer[] = [];
  dataSourceCopy: Customer[] = [];

  searchKeyword: string = ''; // to work with our shared-modal
  isModal: boolean = false;
  editScreen: boolean = false;
  editId: number = 0;

  customerForm : FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address: new FormControl('', [Validators.required]),
    contact: new FormControl(0, [Validators.required, Validators.min(0.01)]),
  });

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) { }

  fetchAll() {
    this.customerService.GetAll().subscribe(
      (res: ServiceResponse) => {
        this.dataSource = res.data;
        this.updateDataSource();
      },
      error => {
        this.openSnackBar(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAll();
  }

  searching() {
    this.updateDataSource();
    this.dataSourceCopy = this.dataSourceCopy.filter(c => c.name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) != -1 );
  }

  deleteClicked(Id: number)
  {
    this.customerService.DeleteById( Id ).subscribe(
      res => {
        this.fetchAll();
      },
      error => {
        this.openSnackBar(error.error.message);
      }
    );
  }

  editClicked(index: number)
  {
    this.editScreen = true;
    this.editId = this.dataSourceCopy[index].id;
    this.customerForm.controls.name.setValue(this.dataSourceCopy[index].name);
    this.customerForm.controls.address.setValue(this.dataSourceCopy[index].address);
    this.customerForm.controls.contact.setValue(this.dataSourceCopy[index].contact);
    this.isModal = true;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;

    if(this.editScreen) 
    {
      var customer = new Customer(this.editId, this.customerForm.value.name, this.customerForm.value.address, this.customerForm.value.contact);
      this.customerService.Update(customer).subscribe(
        res => {
          this.fetchAll();
        }, error => this.openSnackBar(error.error.message),
      );
      return this.modalOpen(false);
    }

    this.customerService.Add(
      new Customer(0, this.customerForm.value.name, this.customerForm.value.address, this.customerForm.value.contact)
    ).subscribe(
      res => {
        this.fetchAll();
      },
      err => this.openSnackBar(err.error.message)
    );
    return this.modalOpen(false);
  }

  openSnackBar(message: string) {
    if(message == undefined) message = "Unknown error has occured. Check your connection please.";
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  modalOpen(bool: boolean) {
    if(bool) return this.isModal = true;
    // else
    this.editScreen = false;
    this.isModal = false;
    this.customerForm.reset();
    return;
  }
  
}
