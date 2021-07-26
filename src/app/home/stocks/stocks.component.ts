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

  displayedColumns: string[] = ['Id', 'ProductId', 'Quantity', 'Edit', 'Remove'];
  dataSource: Stock[] = [];
  dataSourceCopy: Stock[] = [];

  // to work with our shared-modal
  isModal: boolean = false;
  editScreen: boolean = false;
  editId: number = 0;
  
  stockForm : FormGroup = new FormGroup({
    productId: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required]),
  });

  constructor(
    private stockService: StockService,
  ) { }

  fetchAll() {
    this.stockService.GetAll().subscribe(
      (res: Stock[]) => {//success
        this.dataSource = res;
        this.updateDataSource();
      }, error => console.log(error),
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
      console.log(error);
    });
  }

  editClicked(index: number)
  {
    this.editScreen = true;
    this.editId = this.dataSourceCopy[index].id;
    this.stockForm.controls.productId.setValue(this.dataSourceCopy[index].productId);
    this.stockForm.controls.quantity.setValue(this.dataSourceCopy[index].quantity);
    this.isModal = true;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;

    if(this.editScreen) 
    {
      var stock = new Stock(this.editId, this.stockForm.value.productId, this.stockForm.value.quantity);
      this.stockService.Update(stock).subscribe(
        (res: Stock) => {
          this.fetchAll();
        }, error => console.log(error),
      );
      this.editScreen = false;
      this.stockForm.reset();
      return;
    }

    this.stockService.Add(
      new Stock(0, this.stockForm.value.productId, this.stockForm.value.quantity)
    ).subscribe(
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
