import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Stock } from '../models/Stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private http: HttpClient
  ) { }

  private allItems: Stock[] = [];

  public GetAllStocks() : Observable<Stock[]>
  {
    return this.http.get<{ data: { id:number, productId:number, quantity:number, price:number, date:Date }[], message: string, success: string }>(
      'https://localhost:5001/stocks'
    ).pipe(
      map((res) => {
        if(!res.success) throw new Error(res.message);
        this.allItems = [];
        for(var r of res.data) {
          this.allItems.unshift(
            new Stock(r.id, r.productId, r.quantity, r.price, r.date)
          );
        }
        return this.allItems;
      }),
      catchError(err => {
        throw new Error("Data fetching error from the api");
      }),
    );
  }

  public AddStock( productId:number, quantity:number, price:number, date:Date ) : Observable<Stock> {

    return this.http.post<{ data: { id:number, productId:number, quantity:number, price:number, date:Date }, message: string, success: boolean }>(
      'https://localhost:5001/stocks',
      new Stock(0, productId, quantity, price, date)
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let item = new Stock(res.data.id, res.data.productId, res.data.quantity, res.data.price, res.data.date)
        this.allItems.unshift(item);
        return item;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public DeleteStockById(Id: number) : Observable<Stock>
  {
    return this.http.delete<{ data: { id:number, productId:number, quantity:number, price:number, date:Date }, message:string, success:boolean }>(
      `https://localhost:5001/stocks/${Id}`,
      {
        params: new HttpParams().set("Id", Id),
      }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let item = new Stock(res.data.id, res.data.productId, res.data.quantity, res.data.price, res.data.date)
        return item;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

}
