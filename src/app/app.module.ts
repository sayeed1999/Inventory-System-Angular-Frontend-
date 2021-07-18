import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './home/categories/categories.component';
import { ProductsComponent } from './home/products/products.component';
import { StocksComponent } from './home/stocks/stocks.component';
import { CustomersComponent } from './home/customers/customers.component';
import { GorgeousButtonComponent } from './shared/gorgeous-button/gorgeous-button.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MarginTopComponent } from './shared/margin-top/margin-top.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesComponent } from './home/sales/sales.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CategoriesComponent,
    ProductsComponent,
    StocksComponent,
    CustomersComponent,
    GorgeousButtonComponent,
    ToolbarComponent,
    MarginTopComponent,
    DialogComponent,
    SalesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
