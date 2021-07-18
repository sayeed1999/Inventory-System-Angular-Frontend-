import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  editClicked(index: number)
  {
    this.editScreen = true;
    this.editId = this.dataSourceCopy[index].Id;
    this.stockForm.controls.ProductId.setValue(this.dataSourceCopy[index].ProductId);
    this.stockForm.controls.Quantity.setValue(this.dataSourceCopy[index].Quantity);
    this.stockForm.controls.Price.setValue(this.dataSourceCopy[index].Price);
    this.stockForm.controls.Date.setValue(this.dataSourceCopy[index].Date);
    this.isModal = true;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;

    if(this.editScreen) 
    {
      var stock = new Stock(this.editId, this.stockForm.value.ProductId, this.stockForm.value.Quantity, this.stockForm.value.Price, this.stockForm.value.Date);
      this.stockService.UpdateStock(stock).subscribe(
        (res: Stock) => {
          this.fetchAll();
        }, error => console.log(error),
      );
      this.editScreen = false;
      return;
    }

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
