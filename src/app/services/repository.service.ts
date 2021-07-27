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
  ) {}

  // C R U D ..

  public GetAll(): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(
      this.url
    );
  }

  public Add(item: any) : Observable<ServiceResponse> {
    
    return this.http.post<ServiceResponse>(
      this.url,
      item
    );
  }

  public Update(item: any) : Observable<ServiceResponse>
  {
    return this.http.put<ServiceResponse>(
      this.url, //url
      item //body
    );
  }

  public DeleteById(id: number) : Observable<ServiceResponse>
  {
    return this.http.delete<ServiceResponse>(
      `${this.url}/${id}`,
      {
        params: new HttpParams().set("Id", id),
      }
    );
  }
  
}
