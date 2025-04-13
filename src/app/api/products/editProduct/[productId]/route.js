import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        
        const { productId } = params;
        console.log("Received productId:", productId);
        
        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const body = await request.json(); // Correctly extract JSON body
        console.log("Request body received:", body);

        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, body, { 
            new: true,
            runValidators: true,
        });

        console.log("Updated product result:", updatedProduct);

        if (!updatedProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product updated successfully", data: updatedProduct }, { status: 200 });
    } catch (ex) {
        console.error("Error updating product:", ex);
        return NextResponse.json({ message: "Error updating product", error: ex.message }, { status: 500 });
    }
}
