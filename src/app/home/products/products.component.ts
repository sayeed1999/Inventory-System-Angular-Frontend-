import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  displayedColumns: string[] = ['Id', 'Name', 'Price', 'CategoryId', 'Edit', 'Remove'];
  dataSource: Product[] = [];
  dataSourceCopy: Product[] = [];
  allCategories: Category[] = [];

  searchKeyword: string = '';
  searchByCategoryId: number = 0;

  isModal: boolean = false;
  editScreen: boolean = false;
  editId: number = 0;

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

  editClicked(index: number)
  {
    this.editScreen = true;
    this.editId = this.dataSourceCopy[index].Id;
    this.productForm.controls.Name.setValue(this.dataSourceCopy[index].Name);
    this.productForm.controls.Price.setValue(this.dataSourceCopy[index].Price);
    this.productForm.controls.CategoryId.setValue(this.dataSourceCopy[index].CategoryId);
    this.isModal = true;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;

    if(this.editScreen) 
    {
      var product = new Product(this.editId, this.productForm.value.Name, this.productForm.value.Price, this.productForm.value.CategoryId);
      this.productService.UpdateProduct(product).subscribe(
        (res: Product) => {
          this.fetchAllProducts();
        }, error => console.log(error),
      );
      this.editScreen = false;
      this.productForm.reset();
      return;
    }

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
