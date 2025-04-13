import { generateTokens } from "@/lib/generateToken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcryptjs from 'bcryptjs'
import { NextResponse } from "next/server";
export  async function  POST (request) {
    await dbConnect();
    const body = await request.json();
    const {username, password} = body;
    console.log("Received data:", body);
    if(!username || !password) {
        return new Response(JSON.stringify({message: "Please fill all the fields"}), {status: 400})
    }

    const user = await User.findOne({
        $or: [{ username: username }, { password: password }]
    });

    if (!user) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
        return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }

    // Generate tokens
    const tokens = generateTokens(user._id);
    const response = NextResponse.json({ message: "Login successful", userData: user });

    response.cookies.set('accessToken', tokens.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 15 * 60,
        path: '/'
    });

    response.cookies.set('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
    });

    return response;

}