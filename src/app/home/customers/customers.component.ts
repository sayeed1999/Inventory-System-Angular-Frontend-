import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/Customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Name', 'Address', 'Contact', 'Email', 'Remove'];
  dataSource: Customer[] = [];
  searchKeyword: string = '';
  // to work with our shared-modal
  isModal: boolean = false;
  toDestroy1!: Subscription;

  customerForm : FormGroup = new FormGroup({
    Name: new FormControl('', [Validators.required]),
    Address: new FormControl('', [Validators.required]),
    Contact: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.email]),
  });

  constructor(
    private customerService: CustomerService,
  ) { }

  ngOnInit(): void {
    this.updateDataSource();
    this.toDestroy1 = this.customerService.change.subscribe(() => {
      this.updateDataSource();
    });
  }

  ngOnDestroy() {
    this.toDestroy1.unsubscribe();
  }

  searching() {
    this.updateDataSource();
    this.dataSource = this.dataSource.filter(c => c.Name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) != -1 );
  }

  deleteClicked(Id: number)
  {
    this.customerService.DeleteCustomerById( Id );
  }

  updateDataSource = () => this.dataSource = this.customerService.GetAllCustomers();

  onFormSubmit() {
    this.isModal = false;
    this.customerService.AddCustomer(this.customerForm.value.Name, this.customerForm.value.Address, this.customerForm.value.Contact, this.customerForm.value?.Email);
    this.customerForm.reset();
  }

  isValid() : boolean {
    return this.customerForm?.status == "VALID";
  }
}
