import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query string
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    // Forward the request to the backend
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL || "http://localhost:3000"}/api/post/statistics?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
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
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error proxying to backend:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}