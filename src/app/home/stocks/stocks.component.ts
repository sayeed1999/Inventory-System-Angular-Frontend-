import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Stock } from 'src/app/models/Stock.model';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'ProductId', 'Quantity', 'Price', 'Date', 'Remove'];
  dataSource: Stock[] = [];
  dataSourceCopy: Stock[] = [];

  // to work with our shared-modal
  isModal: boolean = false;
  
  stockForm : FormGroup = new FormGroup({
    ProductId: new FormControl('', [Validators.required]),
    Quantity: new FormControl(0, [Validators.required]),
    Price: new FormControl(0, [Validators.required]),
    Date: new FormControl('', [Validators.required]),
  });

  constructor(
    private stockService: StockService,
  ) { }

  fetchAll() {
    this.stockService.GetAllStocks().subscribe(
      (res: Stock[]) => {//success
        this.dataSource = res;
        this.dataSourceCopy = [ ...this.dataSource ];
      }, error => console.log(error),
    );
  }

  ngOnInit(): void {
    this.fetchAll();
  }

  deleteClicked(Id: number)
  {
    this.stockService.DeleteStockById( Id ).subscribe(res => {
      this.fetchAll();
    }, error => {
      console.log(error);
    });
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;
    this.stockService.AddStock(this.stockForm.value.ProductId, this.stockForm.value.Quantity, this.stockForm.value.Price, this.stockForm.value.Date)
      .subscribe(
        res => {
          this.fetchAll(); //success
        }, error => {
          console.log(error);
        }
      );
    this.stockForm.reset();
  }

  isValid() : boolean {
    return this.stockForm?.status == "VALID";
  }
}
