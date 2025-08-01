// app/api/polls/route.ts
import { connectToDatabase } from '@/lib/mongodb';
import { Poll } from '@/models/Poll';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const polls = await Poll.find().sort({ createdAt: -1 });
    return NextResponse.json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const newPoll = new Poll(body);
    await newPoll.save();

    return NextResponse.json(newPoll);
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
}
