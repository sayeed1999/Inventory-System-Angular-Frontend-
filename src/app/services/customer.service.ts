import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Customer } from '../models/Customer.model';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends RepositoryService {

  constructor(
    http: HttpClient
  ) {
    super(http);

    this.endpoint = 'customers';
    this.url += this.endpoint;
  }

}
