import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Customer } from '../models/Customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http: HttpClient
  ) { }

  private allItems: Customer[] = [];

  public GetAllCustomers() : Observable<Customer[]>
  {
    return this.http.get<{ data: { id:number, name:string, address:string, contact:number }[], message: string, success: string }>(
      'https://localhost:5001/customers'
    ).pipe(
      map((res) => {
        if(!res.success) throw new Error(res.message);
        this.allItems = [];
        for(var r of res.data) {
          this.allItems.unshift(
            new Customer(r.id, r.name, r.address, r.contact)
          );
        }
        return this.allItems;
      }),
      catchError(err => {
        throw new Error("Data fetching error from the api");
      }),
    );
  }

  public GetCustomerById(Id: number) : Observable<Customer>
  {
    return this.http.get<{ data: { id:number, name:string, address:string, contact:number }, message: string, success: string }>(
      `https://localhost:5001/customers/${Id}`,
      {
        params: new HttpParams().set('Id', Id),
      }
    ).pipe(
      map((res) => {
        if(!res.success) throw new Error(res.message);
        var item = new Customer(res.data.id, res.data.name, res.data.address, res.data.contact);
        return item;
      }),
      catchError(err => {
        throw new Error("Data fetching error from the api");
      }),
    );
  }

  public AddCustomer( name:string, address:string, contact:number ) : Observable<Customer> {

    return this.http.post<{ data: { id:number, name:string, address:string, contact:number }, message: string, success: boolean }>(
      'https://localhost:5001/customers',
      new Customer(0, name, address, contact)
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let item = new Customer(res.data.id, res.data.name, res.data.address, res.data.contact)
        this.allItems.unshift(item);
        return item;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public DeleteCustomerById(Id: number) : Observable<Customer>
  {
    return this.http.delete<{ data: { id:number, name:string, address:string, contact:number }, message:string, success:boolean }>(
      `https://localhost:5001/customers/${Id}`,
      {
        params: new HttpParams().set("Id", Id),
      }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let item = new Customer(res.data.id, res.data.name, res.data.address, res.data.contact)
        return item;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  
}
