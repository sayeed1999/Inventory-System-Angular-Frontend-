export class Stock {
    constructor(
        public Id: number,
        public ProductId: number,
        public Quantity: number,
        public Price: number,
        public Date: Date,
    ) {}
}