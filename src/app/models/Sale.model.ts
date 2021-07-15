export class Sale {
    constructor(
        public Id: number,
        public ProductId: number,
        public Quantity: number,
        public CustomerId: number,
        public Date: Date
    ) {}
}