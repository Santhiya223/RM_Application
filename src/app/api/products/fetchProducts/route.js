import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const search = searchParams.get("search")?.trim() || "";

    const skip = Math.max((page - 1) * size, 0);
    const limit = Math.max(size, 1);

    // Build search filter
    const filter = search
      ? {
          productName: { $regex: search, $options: "i" }, // case-insensitive
        }
      : {};

    // Fetch filtered and paginated products
    const products = await Product.find(filter).skip(skip).limit(limit);

    // Get total items with the same filter
    const totalProducts = await Product.countDocuments(filter);

    return NextResponse.json({
      message: "Products fetched successfully",
      data: products,
      totalItems: totalProducts,
      page,
      size,
    });
  } catch (error) {
    console.error("error in fetching products:", error);
    return NextResponse.json(
      { message: "error in fetching products", error: error.message },
      { status: 500 }
    );
  }
}
