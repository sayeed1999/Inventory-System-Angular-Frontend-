export class Customer {
    constructor(
        public Id: number,
        public Name: string,
        public Address: string,
        public Contact: number,
        public Email?: string,
    ) {}
}