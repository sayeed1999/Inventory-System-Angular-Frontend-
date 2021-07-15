import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../models/Product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  change = new Subject<void>();

  private allProducts: Product[] = [
    new Product(1, 'Matador Ball Pen', 5, 1),
    new Product(2, 'Matador Gripper', 5, 1),
    new Product(3, 'Matador Ball Pen (Red)', 5, 1),
    new Product(4, 'Matador 2B Pencil', 7, 2),
    new Product(5, 'Favor Castle HB Pencil', 7, 2),
  ];

  public GetAllProducts() : Product[]
  {
    return this.allProducts;
  }

  public GetProductById(Id: number) : Product | undefined
  {
    return this.allProducts.find(p => p.Id === Id);
  }

  public AddProduct(Name: string, Price: number, CategoryId: number) {
    var max = 0;
    this.allProducts.forEach(c => {
      max = c.Id > max ? c.Id : max;
    });
    var newProduct = new Product(
      max+1,
      Name,
      Price,
      CategoryId
    );
    this.allProducts = [...this.allProducts, newProduct];
    this.change.next(); //emitted to inform change!
    return newProduct;
  }

  public DeleteProductById(Id: number) : void
  {
    this.allProducts = this.allProducts.filter(c => c.Id !== Id);
    this.change.next();
  }
}
