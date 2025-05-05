import { NextResponse } from "next/server";
import Order from "@/models/Order";
import dbConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request) {
  try {
    await dbConnect(); // Connect to MongoDB (if not already)

    const body = await request.json();
     const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
        const userId = session.user.id; 
    // You may want to validate body here

    const newOrder = await Order.create({
      user: userId, // make sure userId is passed from frontend if needed
      products: body.products,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      totalPrice: body.totalPrice,
    });

    return NextResponse.json({ success: true, orderId: newOrder._id }, { status: 201 });
  } catch (ex) {
    console.error("Error in placing order:", ex);
    return NextResponse.json({ error: "Error in placing order" }, { status: 500 });
  }
}

export async function GET(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sort = searchParams.get("sort") || "-placedAt";

    const query = { user: userId };

    if (status) {
      query.orderStatus = status;
    }

    if (dateFrom || dateTo) {
      query.placedAt = {};
      if (dateFrom) query.placedAt.$gte = new Date(dateFrom);
      if (dateTo) query.placedAt.$lte = new Date(dateTo);
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ data: orders, total }, { status: 200 });

  } catch (ex) {
    console.error("Error in getting orders:", ex);
    return NextResponse.json({ error: "Error in getting orders" }, { status: 500 });
  }
}

