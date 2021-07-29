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
    date: new FormControl(new Date(), [Validators.required]),
  });

  allCustomers: Customer[] = [];
  allProducts: Product[] = [];

  editProductName = '';
  editCustomerName = '';

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

  editClicked(element: Sale)
  {
    console.log(element)
    this.saleForm.patchValue({
      productId: element.productId,
      quantity: element.quantity,
      customerId: element.customerId,
      date: element.date,
    });
    // console.log(this.saleForm);

    this.editProductName = element.product?.name || '';
    this.editCustomerName = element.customer?.name || '';

    this.editScreen = true;
    this.editId = element.id;
    
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
      return this.modalOpen(false);
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
    this.formReset();
    this.editScreen = false;
    this.isModal = false;
    return;
  }

  formReset() {
    this.saleForm.reset();
    this.saleForm.controls.date.setValue(new Date());
  }

}
