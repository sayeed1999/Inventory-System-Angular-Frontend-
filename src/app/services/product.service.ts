import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/Product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  private allItems: Product[] = [];

  public GetAllProducts() : Observable<Product[]>
  {
    return this.http.get<{ data: { id:number, name:string, price:number, categoryId:number }[], message: string, success: string }>(
      'https://localhost:5001/products'
    ).pipe(
      map((res) => {
        if(!res.success) throw new Error(res.message);
        this.allItems = [];
        for(var r of res.data) {
          this.allItems.unshift(
            new Product(r.id, r.name, r.price, r.categoryId),
          );
        }
        return this.allItems;
      }),
      catchError(err => {
        throw new Error("Data fetching error from the api");
      }),
    );
  }

  public GetProductById(Id: number) : Observable<Product>
  {
    return this.http.get<{ data: { id:number, name:string, price:number, categoryId:number }, message: string, success: boolean }>(
      `https://localhost:5001/products/${Id}`,
      {
        params: new HttpParams().set('Id', Id),
      },
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let item = new Product(res.data.id, res.data.name, res.data.price, res.data.categoryId);
        return item;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public AddProduct(Name: string, Price: number, CategoryId: number) : Observable<Product> {

    return this.http.post<{ data: { id:number, name:string, price:number, categoryId:number }, message: string, success: boolean }>(
      'https://localhost:5001/products',
      new Product(0, Name, Price, CategoryId)
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let item = new Product(res.data.id, res.data.name, res.data.price, res.data.categoryId);
        this.allItems.unshift(item);
        return item;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public DeleteProductById(Id: number) : Observable<Product>
  {
    return this.http.delete<{ data: { id:number, name:string, price:number, categoryId:number }, message:string, success:boolean }>(
      `https://localhost:5001/products/${Id}`,
      {
        params: new HttpParams().set("Id", Id),
      }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let item = new Product(res.data.id, res.data.name, res.data.price, res.data.categoryId);
        return item;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

}
