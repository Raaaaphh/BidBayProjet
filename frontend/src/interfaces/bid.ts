export interface Bid {
    bidder: {
        id: string;
        username: string;
    }
    bidderId: string;
    createdAt: string;
    date: string;
    id: string;
    price: number;
    productId: string;
    updatedAt: string;
}