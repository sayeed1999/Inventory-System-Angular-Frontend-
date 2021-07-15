import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  searchKeyword: string = '';
  searchByCategoryId: number = 0;
  // to work with our shared-modal
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

  ngOnInit(): void {
    this.updateDataSource();
    this.toDestroy1 = this.productService.change.subscribe(() => {
      this.updateDataSource();
    });
  }

  ngOnDestroy() {
    this.toDestroy1.unsubscribe();
  }

  searching() {
    this.updateDataSource();
    this.dataSource = this.dataSource.filter(c => c.Name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) != -1 );
  }

  searchingByCategory() {
    this.searchKeyword = '';
    this.updateDataSource();
    if(this.searchByCategoryId > 0) this.dataSource = this.dataSource.filter(p => p.CategoryId === this.searchByCategoryId);
  }

  deleteClicked(index: number)
  {
    this.productService.DeleteProductById( this.dataSource[index].Id );
    this.searchKeyword = ''; this.searchByCategoryId = 0;
  }

  updateDataSource = () => this.dataSource = this.productService.GetAllProducts();

  onFormSubmit() {
    this.isModal = false;
    this.productService.AddProduct(this.productForm.value.Name, this.productForm.value.Price, this.productForm.value.CategoryId);
    this.productForm.reset();
    this.searchKeyword = ''; this.searchByCategoryId = 0;  
  }

  isValid() : boolean {
    return this.productForm?.status == "VALID";
  }
}
