import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Product } from 'src/app/models/Product.model';
import { Stock } from 'src/app/models/Stock.model';
import { ProductService } from 'src/app/services/product.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'ProductId', 'Quantity', 'Price', 'Date', 'Edit', 'Remove'];
  dataSource: Stock[] = [];
  dataSourceCopy: Stock[] = [];

  // to work with our shared-modal
  isModal: boolean = false;
  editScreen: boolean = false;
  editId: number = 0;
  
  stockForm : FormGroup = new FormGroup({
    productId: new FormControl('', [Validators.required, Validators.min(1)]),
    quantity: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    date: new FormControl('', [Validators.required]),
  });

  allProducts: Product[] = [];
  filteredProducts!: Observable<Product[]>;
  productSearchControl = new FormControl('');

  constructor(
    private stockService: StockService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) { }

  fetchAll() {
    this.stockService.GetAll().subscribe(
      (res) => { // success
        this.dataSource = res.data;
        this.updateDataSource();
      }, 
      error => {
        this.openSnackBar(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAll();

    this.productService.GetAll().subscribe(
      res => this.allProducts = res.data,
      error => this.openSnackBar(error.error.message)
    );

    this.filteredProducts = this.productSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterProducts(value))
      );
  }

  deleteClicked(id: number)
  {
    this.stockService.DeleteById( id ).subscribe(res => {
      this.fetchAll();
    }, error => {
      this.openSnackBar(error.error.message);
    });
  }

  editClicked(index: number)
  {
    this.editScreen = true;
    this.editId = this.dataSourceCopy[index].id;
    this.stockForm.controls.productId.setValue(this.dataSourceCopy[index].productId);
    this.stockForm.controls.quantity.setValue(this.dataSourceCopy[index].quantity);
    this.stockForm.controls.price.setValue(this.dataSourceCopy[index].price);
    this.stockForm.controls.date.setValue(this.dataSourceCopy[index].date);
    
    this.isModal = true;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;

    if(this.editScreen) 
    {
      var stock = new Stock(this.editId, this.stockForm.value.productId, this.stockForm.value.quantity, this.stockForm.value.price, this.stockForm.value.date);
      this.stockService.Update(stock).subscribe(
        (res) => {
          this.fetchAll();
        },
        error => {
          this.openSnackBar(error.error.message);
        }
      );
      this.editScreen = false;
      this.stockForm.reset();
      return;
    }

    this.stockService.Add(
      new Stock(0, this.stockForm.value.productId, this.stockForm.value.quantity, this.stockForm.value.price, this.stockForm.value.date)
    ).subscribe(
        res => {
          this.fetchAll(); //success
        }, error => {
          this.openSnackBar(error.error.message);
        }
      );
    this.stockForm.reset();
  }

  isValid() : boolean {
    return this.stockForm?.status == "VALID";
  }

  openSnackBar(message: string) {
    if(message == undefined) message = "Unknown error has occured. Check your connection please.";
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  private _filterProducts(value: string): Product[] {
    let index = this.allProducts.findIndex(p => p.name === value);
    if(index != -1) {
      this.stockForm.controls.productId.setValue( this.allProducts[index].id );
      return [ this.allProducts[index] ];
    }
    this.stockForm.controls.productId.setValue(0);
    return this.allProducts.filter(product => product.name.toLowerCase().includes( value.toLowerCase() ));
  }

}
