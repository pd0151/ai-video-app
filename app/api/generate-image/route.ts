import { NextResponse } from "next/server";

export async function POST() {
return NextResponse.json({
image: "https://via.placeholder.com/600x600.png?text=AdForge+Test+Image",
});
}