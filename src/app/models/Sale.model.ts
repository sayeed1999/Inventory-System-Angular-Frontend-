import { Customer } from "./Customer.model";
import { Product } from "./Product.model";

export class Sale {
    constructor(
        public Id: number,
        public ProductId: number,
        public Quantity: number,
        public CustomerId: number,
        public Date: Date,
        public Product?: Product,
        public Customer?: Customer
    ) {}
}