import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
      map(res => {
        if(!res.success) throw new Error(res.message);
        this.allItems = res.data;
        return this.allItems;
      }),
      catchError(err => {
        throw new Error("Data fetching error from the api");
      }),
    );
  }

  public GetProductById(id: number) : Observable<Product>
  {
    return this.http.get<{ data: { id:number, name:string, price:number, categoryId:number }, message: string, success: boolean }>(
      `https://localhost:5001/products/${id}`,
      {
        params: new HttpParams().set('Id', id),
      },
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

  public AddProduct(name: string, price: number, categoryId: number) : Observable<Product> {

    return this.http.post<{ data: { id:number, name:string, price:number, categoryId:number }, message: string, success: boolean }>(
      'https://localhost:5001/products',
      new Product(0, name, price, categoryId)
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

  public DeleteProductById(id: number) : Observable<Product>
  {
    return this.http.delete<{ data: { id:number, name:string, price:number, categoryId:number }, message:string, success:boolean }>(
      `https://localhost:5001/products/${id}`,
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

  public UpdateProduct(product: Product) : Observable<Product>
  {
    return this.http.put<{ data: { id:number, name:string, price:number, categoryId:number }, message:string, success:boolean }>(
      `https://localhost:5001/products/${product.id}`, //url
      product, //body
      { //params
        params: new HttpParams().set("Id", product.id),
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
