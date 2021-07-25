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
        // this.allItems = [];
        // for(var r of res.data) {
        //   this.allItems.unshift(
        //     new Customer(r.id, r.name, r.address, r.contact)
        //   );
        // } // eto kisu korsilam!
        this.allItems = res.data;
        return this.allItems;
      }),
      catchError(err => {
        throw new Error("Data fetching error from the api");
      }),
    );
  }

  public GetCustomerById(id: number) : Observable<Customer>
  {
    return this.http.get<{ data: { id:number, name:string, address:string, contact:number }, message: string, success: string }>(
      `https://localhost:5001/customers/${id}`,
      {
        params: new HttpParams().set('Id', id),
      }
    ).pipe(
      map((res) => {
        if(!res.success) throw new Error(res.message);
        var item = res.data;
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
        let item = res.data;
        this.allItems.unshift(item);
        return item;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public DeleteCustomerById(id: number) : Observable<Customer>
  {
    return this.http.delete<{ data: { id:number, name:string, address:string, contact:number }, message:string, success:boolean }>(
      `https://localhost:5001/customers/${id}`,
      {
        params: new HttpParams().set("Id", id),
      }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        return res.data;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public UpdateCustomer(customer: Customer) : Observable<Customer>
  {
    return this.http.put<{ data: { id:number, name:string, address:string, contact:number }, message:string, success:boolean }>(
      `https://localhost:5001/customers/${customer.id}`, //url
      customer, //body
      { //params
        params: new HttpParams().set("Id", customer.id),
      }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        return res.data;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }  
}
