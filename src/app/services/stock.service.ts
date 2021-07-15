import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Stock } from '../models/Stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor() { }

  change = new Subject<void>();

  private allStocks: Stock[] = [
  ];

  public GetAllStocks() : Stock[]
  {
    return this.allStocks;
  }

  public AddStock(ProductId:number, Quantity:number, Price:number, Date:Date) {
    var max = 0;
    this.allStocks.forEach(c => {
      max = c.Id > max ? c.Id : max;
    });
    var newStock = new Stock(
      max+1,
      ProductId,
      Quantity,
      Price,
      Date
    );
    this.allStocks = [...this.allStocks, newStock];
    this.change.next(); //emitted to inform change!
    return newStock;
  }

  public DeleteStockById(Id: number) : void
  {
    this.allStocks = this.allStocks.filter(c => c.Id !== Id);
    this.change.next();
  }
}
