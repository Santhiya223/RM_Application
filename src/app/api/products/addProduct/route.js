// import dbConnect from "@/lib/mongoose";
// import Product from "@/models/Product";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//    try{
//       await dbConnect();
//       const body = await request.json(); // Correctly extract JSON body
//       console.log("Request body received:", body);

//       if (!body || Object.keys(body).length === 0) {
//           return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
//       }
//       // console.log(data);
//       const {productName} = body;
//       console.log(body);
//       console.log(productName);
//       const isExistingProduct = await Product.findOne({productName});
//       if(isExistingProduct){
//          return NextResponse.json({message: "Product already exists"}, {status:400})
//       }
//       const newProduct = new Product(body);
//       await newProduct.save();
//       console.log(`jhwbdfjwf${newProduct}`);
//       return NextResponse.json({ message: "Product added successfully", product: newProduct }, { status: 201 });
//    } catch(ex) {
//       console.error("Error in adding product:", ex);
//       return NextResponse.json({message: "Failed to add product", error: ex.message}, {status:500})
//    }
// }

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { Readable } from "stream";

// helper to convert async file blob to buffer
async function fileToBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const productName = formData.get("productName");
    const price = formData.get("price");
    const description = formData.get("description");
    const stockQty = formData.get("stockQty");
    const imageFile = formData.get("image");

    if (!imageFile || typeof imageFile === "string") {
      return NextResponse.json({ message: "Image is required" }, { status: 400 });
    }

    const imageBuffer = await fileToBuffer(imageFile);

    const isExistingProduct = await Product.findOne({ productName });
    if (isExistingProduct) {
      return NextResponse.json({ message: "Product already exists" }, { status: 400 });
    }

    const product = new Product({
      productName,
      price,
      description,
      stockQty,
      image: {
        data: imageBuffer,
        contentType: imageFile.type,
      },
    });

    await product.save();

    return NextResponse.json({ message: "Product saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

