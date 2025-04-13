import { generateTokens } from "@/lib/generateToken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcryptjs from 'bcryptjs'
import { NextResponse } from "next/server";
export async function POST (request) {
    await dbConnect();
    const body = await request.json();
    const {username, email, password} = body;
    console.log("Received data:", body);

    if(!username || !email || !password){
        return new Response(JSON.stringify({message: "Please fill all the fields"}), {status: 400})
    }

    const isExistingUser = await User.exists({
        $or:[{username,password}]
    });
    if(isExistingUser){
        return new Response(JSON.stringify({message: "User already exists"}), {status: 400});
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        isAdmin: false
    });

    await newUser.save();

    const tokens = generateTokens(newUser._id);
    const response = NextResponse.json({message: "User created successfully"});
    response.cookies.set('accessToken', tokens.accessToken,{
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 15*60,
        path: '/'
    })

    response.cookies.set('refreshToken', tokens.refreshToken,{
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7*24*60*60,
        path: '/'
    })

    return response;
}