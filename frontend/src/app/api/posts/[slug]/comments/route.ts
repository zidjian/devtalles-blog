import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "5";

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    // Forward the request to the backend
    const backendResponse = await fetch(
      `${
        process.env.BACKEND_URL || "http://localhost:3000"
      }/api/comment/post/${slug}?${queryParams.toString()}`,
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
    return NextResponse.json({
      comments: result.data || [],
      pagination: result.meta,
    });
  } catch (error) {
    console.error("Error proxying to backend:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await request.json();

    // Forward the request to the backend
    const backendResponse = await fetch(
      `${
        process.env.BACKEND_URL || "http://localhost:3000"
      }/api/comment/post/${slug}`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
    return NextResponse.json({ comment: result });
  } catch (error) {
    console.error("Error proxying to backend:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
