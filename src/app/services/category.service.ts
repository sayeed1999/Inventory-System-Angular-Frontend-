import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/Category.model';
import { catchError, map, tap } from 'rxjs/operators';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends RepositoryService {

  constructor(
    http: HttpClient
  ) {
    super(http);
    
    this.endpoint = 'categories';
    this.url += this.endpoint;
  }

}
