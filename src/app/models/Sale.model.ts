import { Customer } from "./Customer.model";
import { Product } from "./Product.model";

export class Sale {
    constructor(
        public id: number,
        public productId: number,
        public quantity: number,
        public customerId: number,
        public date: Date,
        public product?: Product,
        public customer?: Customer
    ) {}
}