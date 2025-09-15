import { NextResponse } from 'next/server';

// Mock categories data
const mockCategories = [
    { id: 1, name: "React" },
    { id: 2, name: "Next.js" },
    { id: 3, name: "Backend" },
    { id: 4, name: "TypeScript" },
    { id: 5, name: "CSS" },
];

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    const category = mockCategories.find(cat => cat.id === id);

    if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name } = body;

    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);

    if (categoryIndex === -1) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    mockCategories[categoryIndex].name = name;

    return NextResponse.json({ category: mockCategories[categoryIndex] });
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);

    if (categoryIndex === -1) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const deletedCategory = mockCategories.splice(categoryIndex, 1)[0];

    return NextResponse.json({ category: deletedCategory });
}