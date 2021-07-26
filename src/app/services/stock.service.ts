import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.get<{ data: any[], message: string, success: string }>(
      'https://localhost:5001/stocks'
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

  public AddStock( productId:number, quantity:number, price:number, date:Date ) : Observable<Stock> {

    return this.http.post<{ data: any, message: string, success: boolean }>(
      'https://localhost:5001/stocks',
      new Stock(0, productId, quantity, price, date)
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        this.allItems.unshift(res.data);
        return res.data;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public DeleteStockById(id: number) : Observable<Stock>
  {
    return this.http.delete<{ data: any, message:string, success:boolean }>(
      `https://localhost:5001/stocks/${id}`,
      {
        params: new HttpParams().set("Id", id),
      }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message)
        return res.data;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public UpdateStock(stock: Stock) : Observable<Stock>
  {
    return this.http.put<{ data: any, message:string, success:boolean }>(
      `https://localhost:5001/stocks`, //url
      stock, //body
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
