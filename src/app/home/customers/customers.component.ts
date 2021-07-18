import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/models/Customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Name', 'Address', 'Contact', 'Remove'];
  dataSource: Customer[] = [];
  dataSourceCopy: Customer[] = [];

  searchKeyword: string = ''; // to work with our shared-modal
  isModal: boolean = false;

  customerForm : FormGroup = new FormGroup({
    Name: new FormControl('', [Validators.required]),
    Address: new FormControl('', [Validators.required]),
    Contact: new FormControl('', [Validators.required]),
  });

  constructor(
    private customerService: CustomerService,
  ) { }

  fetchAll() {
    this.customerService.GetAllCustomers().subscribe(
      (res: Customer[]) => {
        this.dataSource = res;
        // console.log(this.dataSource); okay
        this.updateDataSource();
      },
      error => {
        console.log(error);
        // console.log(44444444444444444);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAll();
  }

  searching() {
    this.updateDataSource();
    this.dataSourceCopy = this.dataSourceCopy.filter(c => c.Name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) != -1 );
  }

  deleteClicked(Id: number)
  {
    this.customerService.DeleteCustomerById( Id ).subscribe(
      (res: Customer) => {
        this.fetchAll();
      },
      error => {
        console.log(error);
      }
    );
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;
    this.customerService.AddCustomer(this.customerForm.value.Name, this.customerForm.value.Address, this.customerForm.value.Contact).subscribe(
      res => {
        this.fetchAll();
      }
    );
    this.customerForm.reset();
  }

  isValid() : boolean {
    return this.customerForm?.status == "VALID";
  }
}
