import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    if (!params.categoryId)
      return new NextResponse('Category id is required', { status: 400 });

    const category = await prisma.category.findUnique({
      where: { id: params.categoryId },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Error) console.log('[CATEGORY_GET]', error.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, billboardId } = body.values;

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    for (const value in body.values) {
      if (!value)
        return new NextResponse(`${value} is required`, { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const category = await prisma.category.updateMany({
      where: { id: params.categoryId },
      data: { name, billboardId },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Error) console.log('[CATEGORY_PATCH]', error.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });
    if (!params.categoryId)
      return new NextResponse('Category id is required', { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const category = await prisma.category.deleteMany({
      where: { id: params.categoryId },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Error) console.log('[CATEGORY_PATCH]', error.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
