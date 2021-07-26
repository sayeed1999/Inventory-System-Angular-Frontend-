import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Stock } from '../models/Stock.model';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class StockService extends RepositoryService {

  constructor(
    http: HttpClient
  ) {
    super(http);

    this.endpoint = 'stocks';
    this.url += this.endpoint;
  }

}
