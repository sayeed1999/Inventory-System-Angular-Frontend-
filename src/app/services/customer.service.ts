import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Customer } from '../models/Customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor() { }

  change = new Subject<void>();

  private allCustomers: Customer[] = [
    new Customer(1, "Md. Sayeed Rahman", "Rangpur", 88015555567),
    new Customer(2, "Mhamud Hussen Sifat", "Chapai", 88015555567),
    new Customer(3, "Mahbubul Haque Hamim", "Chapai", 88015555567),
    new Customer(4, "Mucktadir Hasan Sayem", "Isshordi", 88015555567),
  ];

  public GetAllCustomers() : Customer[]
  {
    return this.allCustomers;
  }

  public GetCustomerById(Id:number)
  {
    var customer = this.allCustomers.find(c => c.Id === Id);
    return customer;
  }

  public AddCustomer(Name: string, Address: string, Contact: number, Email?: string) {
    var max = 0;
    this.allCustomers.forEach(c => {
      max = c.Id > max ? c.Id : max;
    });
    var newCustomer = new Customer(
      max+1,
      Name,
      Address,
      Contact,
      Email
    );
    this.allCustomers = [...this.allCustomers, newCustomer];
    this.change.next(); //emitted to inform change!
    return newCustomer;
  }

  public DeleteCustomerById(Id: number) : void
  {
    this.allCustomers = this.allCustomers.filter(c => c.Id !== Id);
    this.change.next();
  }
}
