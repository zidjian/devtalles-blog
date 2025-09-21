import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Forward the request to the backend
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL || "http://localhost:3000"}/api/post/id/${id}`,
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
    return NextResponse.json({ post: result });
  } catch (error) {
    console.error("Error proxying to backend:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    // Forward the request to the backend
    const formData = await request.formData();

    const backendResponse = await fetch(
      `${process.env.BACKEND_URL || "http://localhost:3000"}/api/post/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: authHeader,
        },
        body: formData,
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
