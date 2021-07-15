import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  displayedColumns: string[] = ['Id', 'ProductId', 'Quantity', 'CustomerId', 'Date', 'Remove'];
  dataSource: Sale[] = [];
  isModal: boolean = false;
  toDestroy1!: Subscription;

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

  ngOnInit(): void {
    this.updateDataSource();
    this.toDestroy1 = this.saleService.change.subscribe(() => {
      this.updateDataSource();
    });
  }

  ngOnDestroy() {
    this.toDestroy1.unsubscribe();
  }

  deleteClicked(Id: number)
  {
    this.saleService.DeleteSaleById( Id );
  }

  updateDataSource = () => this.dataSource = this.saleService.GetAllSales();

  onFormSubmit() {
    this.isModal = false;
    this.saleService.AddSale(this.saleForm.value.ProductId, this.saleForm.value.Quantity, this.saleForm.value.CustomerId, this.saleForm.value.Date);
    this.saleForm.reset();
  }

  isValid() : boolean {
    return this.saleForm?.status == "VALID";
  }
}
