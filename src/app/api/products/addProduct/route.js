import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request) {
   try{
      await dbConnect();
      const body = await request.json(); // Correctly extract JSON body
      console.log("Request body received:", body);

      if (!body || Object.keys(body).length === 0) {
          return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
      }
      // console.log(data);
      const {productName} = body;
      console.log(body);
      console.log(productName);
      const isExistingProduct = await Product.findOne({productName});
      if(isExistingProduct){
         return NextResponse.json({message: "Product already exists"}, {status:400})
      }
      const newProduct = new Product(body);
      await newProduct.save();
      console.log(`jhwbdfjwf${newProduct}`);
      return NextResponse.json({ message: "Product added successfully", product: newProduct }, { status: 201 });
   } catch(ex) {
      console.error("Error in adding product:", ex);
      return NextResponse.json({message: "Failed to add product", error: ex.message}, {status:500})
   }
}