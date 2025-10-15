import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Title from "@/models/Title";
import "@/lib/db"; // file kết nối MongoDB

// Lấy title theo ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const title = await Title.findById(id);
    if (!title) {
      return NextResponse.json(
        { error: "Không tìm thấy title" },
        { status: 404 }
      );
    }

    return NextResponse.json(title);
  } catch (error) {
    console.error("Error in /api/title/[id] GET:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Xóa title theo ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const deleted = await Title.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Không tìm thấy title để xóa" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Đã xóa thành công" }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/title/[id] DELETE:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
