import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  displayedColumns: string[] = ['Id', 'Name', 'Price', 'Category', 'AvailableQuantity', 'Edit', 'Remove'];
  dataSource: Product[] = [];
  dataSourceCopy: Product[] = [];
  allCategories: Category[] = [];

  searchKeyword: string = '';
  searchByCategoryId: number = 0;

  isModal: boolean = false;
  editScreen: boolean = false;
  editId: number = 0;

  productForm : FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    categoryId: new FormControl('', [Validators.required, Validators.min(1)]),
    availableQuantity: new FormControl(0),
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) { }

  fetchAllCategories() {
    this.categoryService.GetAll().subscribe(
      res => {
        this.allCategories = res.data;
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  fetchAllProducts() {
    this.productService.GetAll().subscribe(
      res => {
        this.dataSource = res.data;
        this.dataSourceCopy = this.dataSource;
      },
      error => {
        this.openSnackBar(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAllProducts();
    this.fetchAllCategories();
  }

  searching() {
    this.updateDataSource();
    this.dataSourceCopy = this.dataSourceCopy.filter(c => c.name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) != -1 );
  }

  searchingByCategory() {
    this.searchKeyword = '';
    this.updateDataSource();
    if(this.searchByCategoryId > 0) this.dataSourceCopy = this.dataSourceCopy.filter(p => p.categoryId === this.searchByCategoryId);
  }

  deleteClicked(index: number)
  {
    this.productService.DeleteById( this.dataSource[index].id ).subscribe(
      res => {
        this.fetchAllProducts();
      }, error => this.openSnackBar(error.error.message),
    );
    this.searchKeyword = ''; this.searchByCategoryId = 0;
  }

  editClicked(index: number)
  {
    this.editScreen = true;
    this.editId = this.dataSourceCopy[index].id;
    this.productForm.controls.name.setValue(this.dataSourceCopy[index].name);
    this.productForm.controls.price.setValue(this.dataSourceCopy[index].price);
    this.productForm.controls.categoryId.setValue(this.dataSourceCopy[index].categoryId);
    this.productForm.controls.availableQuantity.setValue(this.dataSourceCopy[index].availableQuantity);
    this.isModal = true;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;

    if(this.editScreen) 
    {
      var product = new Product(this.editId, this.productForm.value.name, this.productForm.value.price, this.productForm.value.categoryId, this.productForm.value.availableQuantity);
      this.productService.Update(product).subscribe(
        res => {
          this.fetchAllProducts();
        }, error => this.openSnackBar(error.error.message),
      );
      this.editScreen = false;
      this.productForm.reset();
    }

    this.productService.Add(
      new Product(0, this.productForm.value.name, this.productForm.value.price, this.productForm.value.categoryId, this.productForm.value.availableQuantity)
    ).subscribe(
      res => { //success
        this.fetchAllProducts();
      },
      error => {
        this.openSnackBar(error.error.message);
      }
    );
    this.productForm.reset();
    this.searchKeyword = ''; this.searchByCategoryId = 0;  
  }

  isValid() : boolean {
    // console.log(this.productForm.controls);
    return this.productForm?.status == "VALID";
  }

  openSnackBar(message: string) {
    if(message == undefined) message = "Unknown error has occured. Check your connection please.";
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
  
}
