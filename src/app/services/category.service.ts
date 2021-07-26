import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/Category.model';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient
  ) { }

  // change = new Subject<void>();

  private allCategories: Category[] = [];

  public GetAllCategories() : Observable<Category[]>
  {
    // return this.http.get<{ data: { id:number, name:string, description:string }[], message: string, success: string }>(
    return this.http.get<{ data: any[], message: string, success: string }>( 
      'https://localhost:5001/categories'
    ).pipe(
      map((res) => {
        console.log(res);
        if(!res.success) throw new Error(res.message);
        this.allCategories = res.data;
        return this.allCategories;
      }),
      catchError(err => {
        throw new Error("Data fetching error from the api");
      }),
    );
  }

  public AddCategory(name: string, description: string) : Observable<Category> {
    var newCategory = new Category(
      0, // to be fixed by the Web API, or SQL needs ID = 0/NULL to add a new row
      name,
      description
    );
    return this.http.post<{ data: any, message: string, success: boolean }>(
      'https://localhost:5001/categories',
      newCategory
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let category = res.data;
        this.allCategories.unshift(category);
        return category;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public DeleteCategoryById(id: number) : Observable<Category>
  {
    return this.http.delete<{ data: any, message:string, success:boolean }>(
      `https://localhost:5001/categories/${id}`,
      {
        params: new HttpParams().set("Id", id),
      }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        // let category = new Category(res.data.id, res.data.name, res.data.description); memories! egulao korsilam!
        let category = res.data;
        return category;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public UpdateCategory(category: Category) : Observable<Category>
  {
    return this.http.put<{ data: any, message:string, success:boolean }>(
      `https://localhost:5001/categories`, //url ${category.id}
      category, //body
      // { //params
      //   params: new HttpParams().set("Id", category.id),
      // }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let category = res.data;
        return category;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }
}
