import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
        this.allItems = res.data;
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
        return res.data;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public DeleteSaleById(id: number) : Observable<Sale>
  {
    return this.http.delete<{ data: { id:number, productId:number, quantity:number, customerId:number, date:Date }, message:string, success:boolean }>(
      `https://localhost:5001/sales/${id}`,
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

  public UpdateSale(sale: Sale) : Observable<Sale>
  {
    return this.http.put<{ data: { id:number, productId:number, quantity:number, customerId:number, date:Date }, message:string, success:boolean }>(
      `https://localhost:5001/sales/${sale.id}`, //url
      sale, //body
      { //params
        params: new HttpParams().set("Id", sale.id),
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
