import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
    return this.http.get<{ data: { id:number, name:string, description:string }[], message: string, success: string }>(
      'https://localhost:5001/categories'
    ).pipe(
      map((res) => {
        if(!res.success) throw new Error(res.message);
        this.allCategories = [];
        for(var r of res.data) {
          this.allCategories.unshift(
            new Category(r.id, r.name, r.description)
          );
        }
        return this.allCategories;
      }),
      catchError(err => {
        throw new Error("Data fetching error from the api");
      }),
    );
  }

  public AddCategory(Name: string, Description: string) : Observable<Category> {
    var newCategory = new Category(
      0, // to be fixed by the Web API
      Name,
      Description
    );
    return this.http.post<{ data: { id:number, name:string, description:string }, message: string, success: boolean }>(
      'https://localhost:5001/categories',
      newCategory
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let category = new Category(res.data.id, res.data.name, res.data.description);
        this.allCategories.unshift(category);
        return category;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public DeleteCategoryById(Id: number) : Observable<Category>
  {
    return this.http.delete<{ data: { id:number, name:string, description:string }, message:string, success:boolean }>(
      `https://localhost:5001/categories/${Id}`,
      {
        params: new HttpParams().set("Id", Id),
      }
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        let category = new Category(res.data.id, res.data.name, res.data.description);
        return category;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }
}
