import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Customer } from 'src/app/models/Customer.model';
import { Product } from 'src/app/models/Product.model';
import { Sale } from 'src/app/models/Sale.model';
import { CustomerService } from 'src/app/services/customer.service';
import { ProductService } from 'src/app/services/product.service';
import { SalesService } from 'src/app/services/sales.service';


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
  searchByProduct = '';
  searchByCustomer = '';

  saleForm : FormGroup = new FormGroup({
    productId: new FormControl(0, [Validators.required, Validators.min(1)]),
    quantity: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    customerId: new FormControl(0, [Validators.required, Validators.min(1)]),
    date: new FormControl('', [Validators.required]),
  });

  allCustomers: Customer[] = [];
  allProducts: Product[] = [];

  filteredProducts!: Observable<any[]>;
  filteredCustomers!: Observable<any[]>;

  productSearchControl = new FormControl('');
  customerSearchControl = new FormControl('');


  constructor(
    private saleService: SalesService,
    private productService: ProductService,
    private customerService: CustomerService,
    private  snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchAll();

    this.productService.GetAll().subscribe(
      res => this.allProducts = res.data,
      error => this.openSnackBar(error.error.message),
    );
    this.customerService.GetAll().subscribe(
      res => this.allCustomers = res.data,
      error => this.openSnackBar(error.error.message),
    );
    
    this.filteredCustomers = this.customerSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCustomers(value))
      );

    this.filteredProducts = this.productSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterProducts(value))
      );
  }

  searchingByProduct() {
    this.updateDataSource();
    this.dataSourceCopy = this.dataSourceCopy.filter(sale => sale.product?.name.toLowerCase().includes( this.searchByProduct.toLowerCase() ));
  }
  searchingByCustomer() {
    this.updateDataSource();
    this.dataSourceCopy = this.dataSourceCopy.filter(sale => sale.customer?.name.toLowerCase().includes( this.searchByCustomer.toLowerCase() ));
  }

  fetchAll() {
    this.saleService.GetAll().subscribe(
      res => {
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

  deleteClicked(id: number)
  {
    this.saleService.DeleteById(id).subscribe(
      res => { //deleted one returned!
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
    this.saleForm.controls.date.setValue( this.dataSourceCopy[index].date );

    this.productSearchControl.setValue( this.dataSourceCopy[index].product?.name );
    this.customerSearchControl.setValue( this.dataSourceCopy[index].customer?.name );
    
    this.isModal = true;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  onFormSubmit() {
    this.isModal = false;

    if(this.editScreen) 
    {
      var sale = new Sale(this.editId, this.saleForm.value.productId, this.saleForm.value.quantity, this.saleForm.value.customerId, this.saleForm.value.date);
      this.saleService.Update(sale).subscribe(
        res => {
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
        res => {
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

  private _filterProducts(value: any): any[] {
    let index = this.allProducts.findIndex(op => op.name === value); //identical
    if(index != -1) { //match found
      this.saleForm.controls.productId.setValue( this.allProducts[index].id );
      return [ this.allProducts[index] ];
    }
    this.saleForm.controls.productId.setValue(0);
    const filterValue = value.toLowerCase();
    return this.allProducts.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _filterCustomers(value: any): any[] {
    let index = this.allCustomers.findIndex(op => op.name === value); //identical
    
    if(index != -1) { //match found
      this.saleForm.controls.customerId.setValue( this.allCustomers[index].id );
      return [ this.allCustomers[index] ];
    }
    this.saleForm.controls.customerId.setValue(0);
    const filterValue = value.toLowerCase();

    return this.allCustomers.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  
}
