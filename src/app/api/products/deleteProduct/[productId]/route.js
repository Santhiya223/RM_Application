import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function DELETE(request, {params}) {
    try {
        const {productId} = await params;
        if(!productId)
            return NextResponse.json({message: "product id is required"}, {status: 404})

        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
          }
          return NextResponse.json({ message: "Product deleted successfully", deletedProduct });
    } catch(ex) {
        return NextResponse.json({message: "error in deleting product"}, {status: 500})
    }
}