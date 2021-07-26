import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServiceResponse } from '../models/ServiceResponse.model';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  private all: any[] = [];
  protected url: string = 'https://localhost:5001/';
  protected endpoint: string = '';

  constructor(
    protected http: HttpClient
  ) {
  }

  // CRUD..

  public GetAll(): Observable<any[]> {
    return this.http.get<ServiceResponse>(
      this.url
    ).pipe(
      map(res => {
        console.log(res);
        this.all = res.data;
        return this.all;
      }),
      catchError((error: Error) => {
        throw new Error(error.message);
      })
    );
  }

  public Add(item: any) : Observable<any> {
    
    return this.http.post<ServiceResponse>(
      this.url,
      item
    ).pipe(
      map(res => {
        if(!res.success) throw new Error(res.message);
        this.all.unshift(res.data);
        return res.data;
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  public Update(item: any) : Observable<any>
  {
    return this.http.put<ServiceResponse>(
      this.url, //url
      item //body
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

  public DeleteById(id: number) : Observable<any>
  {
    return this.http.delete<ServiceResponse>(
      `${this.url}/${id}`,
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


}
