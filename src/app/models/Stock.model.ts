import { Product } from "./Product.model";

export class Stock {
    constructor(
        public id: number,
        public productId: number,
        public quantity: number,
        public price: number,
        public product?: Product
    ) {}
}