import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from 'src/app/models/Customer.model';
import { Product } from 'src/app/models/Product.model';
import { Sale } from 'src/app/models/Sale.model';
import { SalesService } from 'src/app/services/sales.service';

export class Model {

}

@Component({
  selector: 'sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Product', 'Quantity', 'Customer', 'Date', 'Edit', 'Remove'];
  dataSource: Sale[] = [];
  dataSourceCopy: Sale[] = [];

  isModal: boolean = false;
  editScreen: boolean = false;
  editId: number = 0;

  saleForm : FormGroup = new FormGroup({
    productId: new FormControl(0, [Validators.required]),
    quantity: new FormControl(0, [Validators.required]),
    customerId: new FormControl(0, [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });

  constructor(
    private saleService: SalesService,
    private  snackBar: MatSnackBar
  ) { }

  allCustomers: Customer[] = [];
  allProducts: Product[] = [];

  fetchAll() {
    this.saleService.GetAll().subscribe(
      (res: Sale[]) => {
        this.dataSource = res;
        this.updateDataSource();
      },
      error => {
        this.openSnackBar(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAll();
  }


  deleteClicked(id: number)
  {
    this.saleService.DeleteById(id).subscribe(
      (res: Sale) => { //deleted one returned!
        this.fetchAll();
        this.updateDataSource();
      },
      error => this.openSnackBar(error.error.message),
    );
  }

  editClicked(index: number)
  {
    this.editScreen = true;
    this.editId = this.dataSourceCopy[index].id;
    this.saleForm.controls.productId.setValue(this.dataSourceCopy[index].productId);
    this.saleForm.controls.quantity.setValue(this.dataSourceCopy[index].quantity);
    this.saleForm.controls.customerId.setValue(this.dataSourceCopy[index].customerId);
    this.isModal = true;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;

    if(this.editScreen) 
    {
      var sale = new Sale(this.editId, this.saleForm.value.productId, this.saleForm.value.quantity, this.saleForm.value.customerId, this.saleForm.value.date);
      this.saleService.Update(sale).subscribe(
        (res: Sale) => {
          this.fetchAll();
        }, error => this.openSnackBar(error.error.message),
      );
      this.editScreen = false;
      this.saleForm.reset();
      return;
    }

    this.saleService.Add(
      new Sale(0, this.saleForm.value.productId, this.saleForm.value.quantity, this.saleForm.value.customerId, this.saleForm.value.date)
    ).subscribe(
        (res: Sale) => {
            this.fetchAll();
            this.updateDataSource();
        },
            error => this.openSnackBar(error.error.message),
        );
    this.saleForm.reset();
  }

  isValid() : boolean {
    return this.saleForm?.status == "VALID";
  }

  openSnackBar(message: string) {
    if(message == undefined) message = "Unknown error has occured. Check your connection please.";
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
