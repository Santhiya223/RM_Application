import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await dbConnect();
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1", 10);
        const size = parseInt(searchParams.get("size") || "10", 10);

        console.log("page :", page);
        console.log("size:", size);
        
        // Calculate skip and limit
        const skip = Math.max(page * size, 0); // Change here to allow for page 0
        const limit = Math.max(size, 1);

        // Fetch paginated products
        const products = await Product.find().skip(skip).limit(limit);

        // Count total documents
        const totalProducts = await Product.countDocuments();

        return NextResponse.json({
            message: "Products fetched successfully",
            data: products,
            totalItems: totalProducts,
            page,
            size,
        });
    } catch (error) {
        console.error("error in fetching products:", error);
        return NextResponse.json({ message: "error in fetching products", error: error.message }, { status: 500 });
    }
}