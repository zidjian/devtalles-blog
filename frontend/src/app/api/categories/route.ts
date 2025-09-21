import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the backend
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL || "http://localhost:3000"}/api/category`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!backendResponse.ok) {
      let errorData;
      const contentType = backendResponse.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        errorData = await backendResponse.json();
      } else {
        const errorText = await backendResponse.text();
        errorData = {
          error: "Backend error",
          message: errorText.length > 500 ? "Internal server error" : errorText,
          status: backendResponse.status,
        };
      }

      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const result = await backendResponse.json();

    // Add "All" category at the beginning
    const categoriesWithAll = [
      { id: 0, name: "All" },
      ...(result.data || result),
    ];

    return NextResponse.json({ categories: categoriesWithAll });
  } catch (error) {
    console.error("Error proxying to backend:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
