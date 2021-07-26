import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/Product.model';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends RepositoryService {

  constructor(
    http: HttpClient
  ) {
    super(http);

    this.endpoint = 'products';
    this.url += this.endpoint;
  }

}
