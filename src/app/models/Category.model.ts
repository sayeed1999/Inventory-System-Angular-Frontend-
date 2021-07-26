import { Product } from "./Product.model";

export class Category
{
    constructor(
        public id : number, 
        public name : string, 
        public description : string,
        public products?: Product[]
    ) {}
}