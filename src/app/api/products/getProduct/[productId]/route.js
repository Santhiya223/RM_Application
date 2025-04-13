import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        await dbConnect();
        
        const {productId} = await params
        if(!productId) return;
        const product = await Product.findById(productId);
        if(!product){
            return NextResponse.json({message: "Product not found"}, {status:400});
        }
        return NextResponse.json({message: "Product fetched successfully", data: product}, {status: 200});
            
    } catch (ex) {
        console.error("error in fetching product details", ex);
        return NextResponse.json({message: "error in fetching product details", error: ex.message}, {status: 500})
    }
}