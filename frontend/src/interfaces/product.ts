import { Bid } from "./bid"

export interface Product {
    id?: string
    name: string
    description: string
    category: string
    sellerId?: number
    originalPrice: number
    pictureUrl: string
    endDate: string
    seller?: {
        id: number
        username: string
    }
    bids?: Bid[]
}