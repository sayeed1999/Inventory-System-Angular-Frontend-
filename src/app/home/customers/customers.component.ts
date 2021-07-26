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

  displayedColumns: string[] = ['Id', 'Name', 'Address', 'Contact', 'Edit', 'Remove'];
  dataSource: Customer[] = [];
  dataSourceCopy: Customer[] = [];

  searchKeyword: string = ''; // to work with our shared-modal
  isModal: boolean = false;
  editScreen: boolean = false;
  editId: number = 0;

  customerForm : FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    contact: new FormControl('', [Validators.required]),
  });

  constructor(
    private customerService: CustomerService,
  ) { }

  fetchAll() {
    this.customerService.GetAllCustomers().subscribe(
      (res: Customer[]) => {
        this.dataSource = res;
        this.updateDataSource();
      },
      error => {
        console.log(error);
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
    this.customerService.DeleteCustomerById( Id ).subscribe(
      (res: Customer) => {
        this.fetchAll();
      },
      error => {
        console.log(error);
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
      this.customerService.UpdateCustomer(customer).subscribe(
        (res: Customer) => {
          this.fetchAll();
        }, error => console.log(error),
      );
      this.editScreen = false;
      this.customerForm.reset();
      return;
    }

    this.customerService.AddCustomer(this.customerForm.value.name, this.customerForm.value.address, this.customerForm.value.contact).subscribe(
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
