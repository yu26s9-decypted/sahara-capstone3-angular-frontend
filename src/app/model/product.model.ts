export interface Product{
    productId: number;
    name: string;
    price: number;
    categoryId: number;
    description: string;
    subCategory: string
    stock: number
    isFeatured: boolean
    imageUrl: string
}