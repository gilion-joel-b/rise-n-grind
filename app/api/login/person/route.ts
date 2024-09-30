import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  const { username } = await request.json()
  try {
    const person =
      await sql`
    SELECT * FROM Persons
    WHERE TRIM(LOWER(username)) = TRIM(LOWER(${username}))
    limit 1;
    `;

    if (person.rows.length === 0) {
      return NextResponse.json({ error: "No person found" }, { status: 404 });
    }


    return NextResponse.json({ person: person.rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
