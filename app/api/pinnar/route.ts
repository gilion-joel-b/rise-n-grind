import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export type CreatePinne = {
  personId: number;
};

export async function POST(request: Request) {
  const { personId } = await request.json() satisfies CreatePinne;
  try {
    const result =
      await sql`
      INSERT INTO Pinne (person_id)
      VALUES (${personId});
    `;
    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}



