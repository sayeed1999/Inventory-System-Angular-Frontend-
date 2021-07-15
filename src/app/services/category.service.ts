import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Category } from '../models/Category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }

  change = new Subject<void>();

  private allCategories: Category[] = [
    { Id: 1, Name: 'Pen', Description: '...' },
    { Id: 2, Name: 'Pencil', Description: '...' },
  ];

  public GetAllCategories() : Category[]
  {
    return this.allCategories;
  }

  public AddCategory(Name: string, Description: string) {
    var max = 0;
    this.allCategories.forEach(c => {
      max = c.Id > max ? c.Id : max;
    });
    var newCategory = new Category(
      max+1,
      Name,
      Description
    );
    this.allCategories = [...this.allCategories, newCategory];
    this.change.next(); //emitted to inform change!
    return newCategory;
  }

  public DeleteCategoryById(Id: number) : void
  {
    this.allCategories = this.allCategories.filter(c => c.Id !== Id);
    this.change.next();
  }
}
