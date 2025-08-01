// app/api/comments/route.ts
import { connectToDatabase } from '@/lib/mongodb';
import { Comment } from '@/models/Comment';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pollId = searchParams.get('pollId');

  await connectToDatabase();

  const comments = await Comment.find({ pollId }).sort({ createdAt: 1 });
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const body = await req.json();
  await connectToDatabase();

  const comment = new Comment(body);
  await comment.save();

  return NextResponse.json(comment);
}
