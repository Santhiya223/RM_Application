import { NextResponse } from "next/server";

export async function POST(request) {
    const response = NextResponse.json({message: "Logout Successfull"});

    response.cookies.set("accessToken", '',{
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0),
        path: '/'
    });

    response.cookies.set("refreshToken", '',{
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0),
        path: '/'
    });

    return response

}