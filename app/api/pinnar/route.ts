import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export type CreatePinne = {
  personId: number;
  createdAt: string;
};

export async function POST(request: Request) {
  const { personId, createdAt } = await request.json() satisfies CreatePinne;
  try {
    const result =
      await sql`
      INSERT INTO Persons (person_id, created_at)
      VALUES (${personId}, ${createdAt});
    `;
    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
