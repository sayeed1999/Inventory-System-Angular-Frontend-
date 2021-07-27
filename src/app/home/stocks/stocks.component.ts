import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Stock } from 'src/app/models/Stock.model';
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
    productId: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });

  constructor(
    private stockService: StockService,
    private snackBar: MatSnackBar
  ) { }

  fetchAll() {
    this.stockService.GetAll().subscribe(
      (res: Stock[]) => {//success
        this.dataSource = res;
        this.updateDataSource();
      }, error => {
        this.openSnackBar(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAll();
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
        (res: Stock) => {
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
}
