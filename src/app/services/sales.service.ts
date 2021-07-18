import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Customer } from '../models/Customer.model';
import { Product } from '../models/Product.model';
import { Sale } from '../models/Sale.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(
    private http: HttpClient
  ) { }

  private allItems: Sale[] = [];

  public GetAllSales() : Observable<Sale[]>
  {
    return this.http.get<{ data: { id:number, productId:number, quantity:number, customerId:number, date:Date, product:{ id:number, name:string, price:number, categoryId:number }, customer:{ id:number, name:string, address:string, contact:number } }[], message: string, success: string }>(
      'https://localhost:5001/sales'
    ).pipe(
      map((res) => {
        if(!res.success) throw new Error(res.message);
        this.allItems = [];
        for(var r of res.data) {
          var pr = new Product(r.product.id, r.product.name, r.product.price, r.product.categoryId);
          var cu = new Customer(r.customer.id, r.customer.name, r.customer.address, r.customer.contact);
          this.allItems.unshift(
            new Sale(r.id, r.productId, r.quantity, r.customerId, r.date, pr, cu)
          );
        }
        return this.allItems;
      }),
      catchError(err => {
        throw new Error("Data fetching error from the api");
      }),
    );
  }

  public AddSale( productId:number, quantity:number, customerId:number, date:Date ) : Observable<Sale> {

    return this.http.post<{ data: { id:number, productId:number, quantity:number, customerId:number, date:Date }, message: string, success: boolean }>(
      'https://localhost:5001/sales',
      new Sale(0, productId, quantity, customerId, date)
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let item = new Sale(res.data.id, res.data.productId, res.data.quantity, res.data.customerId, res.data.date)
        return item;
      }),
      catchError(err => {
        
        throw new Error(err);
      })
    );
  }

  public DeleteSaleById(Id: number) : Observable<Sale>
  {
    return this.http.delete<{ data: { id:number, productId:number, quantity:number, customerId:number, date:Date }, message:string, success:boolean }>(
      `https://localhost:5001/sales/${Id}`,
      {
        params: new HttpParams().set("Id", Id),
      }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let item = new Sale(res.data.id, res.data.productId, res.data.quantity, res.data.customerId, res.data.date)
        return item;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public UpdateSale(sale: Sale) : Observable<Sale>
  {
    return this.http.put<{ data: { id:number, productId:number, quantity:number, customerId:number, date:Date }, message:string, success:boolean }>(
      `https://localhost:5001/sales/${sale.Id}`, //url
      sale, //body
      { //params
        params: new HttpParams().set("Id", sale.Id),
      }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let sale = new Sale(res.data.id, res.data.productId, res.data.quantity, res.data.customerId, res.data.date);
        return sale;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

}
