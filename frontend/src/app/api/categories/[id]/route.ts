import { NextResponse } from 'next/server';

// Mock categories data
const mockCategories = [
    { id: 1, name: 'React' },
    { id: 2, name: 'Next.js' },
    { id: 3, name: 'Backend' },
    { id: 4, name: 'TypeScript' },
    { id: 5, name: 'CSS' },
];

import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const category = mockCategories.find(cat => cat.id === parseInt(id));

    if (!category) {
        return NextResponse.json(
            { error: 'Category not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ category });
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();
    const { name } = body;

    const categoryIndex = mockCategories.findIndex(
        cat => cat.id === parseInt(id)
    );

    if (categoryIndex === -1) {
        return NextResponse.json(
            { error: 'Category not found' },
            { status: 404 }
        );
    }

    mockCategories[categoryIndex].name = name;

    return NextResponse.json({ category: mockCategories[categoryIndex] });
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const categoryIndex = mockCategories.findIndex(
        cat => cat.id === parseInt(id)
    );

    if (categoryIndex === -1) {
        return NextResponse.json(
            { error: 'Category not found' },
            { status: 404 }
        );
    }

    const deletedCategory = mockCategories.splice(categoryIndex, 1)[0];

    return NextResponse.json({ category: deletedCategory });
}
