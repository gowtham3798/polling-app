// app/api/polls/[id]/route.ts
import { connectToDatabase } from '@/lib/mongodb';
import { Poll } from '@/models/Poll';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: any) {
  await connectToDatabase();
  const poll = await Poll.findById(params.id);
  return NextResponse.json(poll);
}

export async function POST(req: Request, { params }: any) {
  const { answers, email } = await req.json();
  await connectToDatabase();

  const poll = await Poll.findById(params.id);
  poll.questions.forEach((q: any, qIdx: number) => {
    q.options.forEach((opt: any, oIdx: number) => {
      if (answers[qIdx] === oIdx) {
        opt.votes += 1;
      }
    });
  });
  await poll.save();

  return NextResponse.json(poll);
}
