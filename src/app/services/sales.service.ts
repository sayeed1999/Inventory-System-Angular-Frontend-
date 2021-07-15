import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Sale } from '../models/Sale.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor() { }

  change = new Subject<void>();

  private allSales: Sale[] = [
  ];

  public GetAllSales() : Sale[]
  {
    return this.allSales;
  }

  public AddSale(ProductId:number, Quantity:number, CustomerId:number, Date:Date) {
    var max = 0;
    this.allSales.forEach(c => {
      max = c.Id > max ? c.Id : max;
    });
    var newSale = new Sale(
      max+1,
      ProductId,
      Quantity,
      CustomerId,
      Date
    );
    this.allSales = [...this.allSales, newSale];
    this.change.next(); //emitted to inform change!
    return newSale;
  }

  public DeleteSaleById(Id: number) : void
  {
    this.allSales = this.allSales.filter(c => c.Id !== Id);
    this.change.next();
  }

}
