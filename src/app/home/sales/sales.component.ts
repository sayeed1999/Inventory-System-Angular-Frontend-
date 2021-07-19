import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/models/Customer.model';
import { Product } from 'src/app/models/Product.model';
import { Sale } from 'src/app/models/Sale.model';
import { CustomerService } from 'src/app/services/customer.service';
import { ProductService } from 'src/app/services/product.service';
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
    ProductId: new FormControl(0, [Validators.required]),
    Quantity: new FormControl(0, [Validators.required]),
    CustomerId: new FormControl(0, [Validators.required]),
    Date: new FormControl('', [Validators.required]),
  });

  constructor(
    private saleService: SalesService,
    public customerService: CustomerService,
    public productService: ProductService
  ) { }

  allCustomers: Customer[] = [];
  allProducts: Product[] = [];

  fetchAll() {
    this.saleService.GetAllSales().subscribe(
      (res: Sale[]) => {
        this.dataSource = res;
        this.updateDataSource();
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAll();
  }


  deleteClicked(Id: number)
  {
    this.saleService.DeleteSaleById(Id).subscribe(
      (res: Sale) => { //deleted one returned!
        this.fetchAll();
        this.updateDataSource();
      },
      error => console.log(error),
    );
  }

  editClicked(index: number)
  {
    this.editScreen = true;
    this.editId = this.dataSourceCopy[index].Id;
    this.saleForm.controls.ProductId.setValue(this.dataSourceCopy[index].ProductId);
    this.saleForm.controls.Quantity.setValue(this.dataSourceCopy[index].Quantity);
    this.saleForm.controls.CustomerId.setValue(this.dataSourceCopy[index].CustomerId);
    this.isModal = true;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;

    if(this.editScreen) 
    {
      var sale = new Sale(this.editId, this.saleForm.value.ProductId, this.saleForm.value.Quantity, this.saleForm.value.CustomerId, this.saleForm.value.Date);
      this.saleService.UpdateSale(sale).subscribe(
        (res: Sale) => {
          this.fetchAll();
        }, error => console.log(error),
      );
      this.editScreen = false;
      this.saleForm.reset();
      return;
    }

    this.saleService.AddSale(this.saleForm.value.ProductId, this.saleForm.value.Quantity, this.saleForm.value.CustomerId, this.saleForm.value.Date)
        .subscribe(
            (res: Sale) => {
              // added one..
              this.fetchAll();
              this.updateDataSource();
            },
            error => console.log(error),
        );
    this.saleForm.reset();
  }

  isValid() : boolean {
    return this.saleForm?.status == "VALID";
  }
}
