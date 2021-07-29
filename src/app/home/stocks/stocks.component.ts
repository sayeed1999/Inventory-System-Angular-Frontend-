import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
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
  searchByProduct = '';
  
  stockForm : FormGroup = new FormGroup({
    productId: new FormControl('', [Validators.required, Validators.min(1)]),
    quantity: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    date: new FormControl(new Date(), [Validators.required]),
  });

  allProducts: Product[] = [];

  constructor(
    private stockService: StockService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) { }

  fetchAll() {
    this.stockService.GetAll().subscribe(
      (res) => { // success
        // this.dataSource = res.data;
        this.dataSource = [];
        for(let i of res.data) this.dataSource.unshift(i);
        this.updateDataSource();
      }, 
      error => {
        this.openSnackBar(error.error.message);
      }
    );
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  ngOnInit(): void {
    this.fetchAll();

    this.productService.GetAll().subscribe(
      res => this.allProducts = res.data,
      error => this.openSnackBar(error.error.message)
    );

  }

  searchingByProduct() {
    this.updateDataSource();
    this.dataSourceCopy = this.dataSourceCopy.filter(sale => sale.product?.name.toLowerCase().includes( this.searchByProduct.toLowerCase() ));
  }

  // C R U D ..

  deleteClicked(id: number)
  {
    this.stockService.DeleteById( id ).subscribe(res => {
      this.fetchAll();
    }, error => {
      this.openSnackBar(error.error.message);
    });
  }

  editProductName: string = '';
  editClicked(index: number)
  {
    this.editScreen = true;
    this.editId = this.dataSourceCopy[index].id;
    this.stockForm.controls.productId.setValue(this.dataSourceCopy[index].productId);
    this.stockForm.controls.quantity.setValue(this.dataSourceCopy[index].quantity);
    this.stockForm.controls.price.setValue(this.dataSourceCopy[index].price);
    this.stockForm.controls.date.setValue(this.dataSourceCopy[index].date);

    this.editProductName = this.dataSourceCopy[index].product?.name || '';

    this.isModal = true;
  }

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

      return this.modalOpen(false);
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
    
      return this.modalOpen(false);
  }

  openSnackBar(message: string) {
    if(message == undefined) message = "Unknown error has occured. Check your connection please.";
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  modalOpen(bool: boolean) {
    if(bool) return this.isModal = true;
    // else
    this.editScreen = false;
    this.isModal = false;
    this.formReset();
    return;
  }

  formReset() {
    this.stockForm.reset();
    this.stockForm.controls.date.setValue(new Date());
  }

}
