import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({}, { status: 401 });
    }

    const payload = jwt.decode(accessToken);
    if (!payload || !payload.exp) {
      return NextResponse.json({}, { status: 401 });
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return NextResponse.json({}, { status: 401 });
    }

    // Exponer únicamente datos necesarios para UI
    const user = {
      userId: payload.userId,
      role: payload.role,
      isAdmin: !!payload.isAdmin,
    };

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
}

