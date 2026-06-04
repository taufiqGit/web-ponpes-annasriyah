import { NextRequest, NextResponse } from "next/server";
import { CategoryType, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

function parseCategoryType(value: string | null): CategoryType | undefined {
  if (value === "NEWS" || value === "ACTIVITY" || value === "GALLERY") {
    return value;
  }
  return undefined;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = parseCategoryType(searchParams.get("type"));
  const where: Prisma.CategoryWhereInput = {};
  if (type) where.type = type;
  const items = await prisma.category.findMany({ where, orderBy: { name: "asc" } });
  return NextResponse.json(items);
}
