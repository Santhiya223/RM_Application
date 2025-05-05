import Cart from "@/models/Cart";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity, price } = body;
    const userId = session.user.id; 
  
    try {
      let cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }
  
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );
  
      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity = quantity;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }
  
      await cart.save();
      return NextResponse.json({ cart }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }

  export async function GET(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  console.log("User ID from session:", userId);

    try {
      const cart = await Cart.findOne({ user: userId }).populate('items.product');
      return NextResponse.json(cart || { items: [] }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  export async function DELETE(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id; 
  
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }
  
    try {
      const cart = await Cart.findOne({ user: userId });
      
      if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }
  
      // Remove the item from the cart
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
      
      await cart.save();
      return NextResponse.json({ 
        success: true,
        cart: await Cart.findOne({ user: userId }).populate('items.product')
      }, { status: 200 });
      
    } catch (error) {
      return NextResponse.json({ 
        error: "Internal Server Error",
        message: error.message 
      }, { status: 500 });
    }
  }
  