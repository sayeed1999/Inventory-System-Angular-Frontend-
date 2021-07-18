import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/Category.model';
import { Product } from 'src/app/models/Product.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Name', 'Price', 'CategoryId', 'Remove'];
  dataSource: Product[] = [];
  dataSourceCopy: Product[] = [];
  allCategories: Category[] = [];

  searchKeyword: string = '';
  searchByCategoryId: number = 0;

  isModal: boolean = false;
  toDestroy1!: Subscription;

  productForm : FormGroup = new FormGroup({
    Name: new FormControl('', [Validators.required]),
    Price: new FormControl(0, [Validators.required]),
    CategoryId: new FormControl('', [Validators.required]),
  });

  constructor(
    private productService: ProductService,
    public categoryService: CategoryService,
  ) { }

  fetchAllCategories() {
    this.categoryService.GetAllCategories().subscribe(
      (res: Category[]) => {
        this.allCategories = res;
      },
      error => {
        console.log(error);
      }
    );
  }

  fetchAllProducts() {
    this.productService.GetAllProducts().subscribe(
      (res: Product[]) => {
        this.dataSource = res;
        this.dataSourceCopy = this.dataSource;
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAllProducts();
    this.fetchAllCategories();
  }

  searching() {
    this.updateDataSource();
    this.dataSourceCopy = this.dataSourceCopy.filter(c => c.Name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) != -1 );
  }

  searchingByCategory() {
    this.searchKeyword = '';
    this.updateDataSource();
    if(this.searchByCategoryId > 0) this.dataSourceCopy = this.dataSourceCopy.filter(p => p.CategoryId === this.searchByCategoryId);
  }

  deleteClicked(index: number)
  {
    this.productService.DeleteProductById( this.dataSource[index].Id ).subscribe(
      res => {
        this.fetchAllProducts();
      }, error => console.log(error),
    );
    this.searchKeyword = ''; this.searchByCategoryId = 0;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;
    this.productService.AddProduct(this.productForm.value.Name, this.productForm.value.Price, this.productForm.value.CategoryId).subscribe(
      res => {
        //success
        this.fetchAllProducts();
      },
      error => {
        console.log(error);
      }
    );
    this.productForm.reset();
    this.searchKeyword = ''; this.searchByCategoryId = 0;  
  }

  isValid() : boolean {
    return this.productForm?.status == "VALID";
  }
}
