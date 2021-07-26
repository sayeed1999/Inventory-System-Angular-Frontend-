import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Customer } from '../models/Customer.model';
import { Product } from '../models/Product.model';
import { Sale } from '../models/Sale.model';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService extends RepositoryService {

  constructor(
    http: HttpClient
  ) {
    super(http);

    this.endpoint = 'sales';
    this.url += this.endpoint;
  }

}