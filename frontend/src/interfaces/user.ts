import { Bid } from "./bid";
import { Product } from "./product";

export interface User {
    admin: boolean;
    bids: Bid[];
    createdAt: string;
    email: string;
    id: string;
    products: Product[];
    updatedAt: string;
    username: string;
}