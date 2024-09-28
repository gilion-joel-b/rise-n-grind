import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export type CreatePerson = {
  name: string;
  email: string;
};

export async function POST(request: Request) {
  const { name, email } = await request.json() satisfies CreatePerson;
  try {
    const result =
      await sql`
    CREATE TABLE IF NOT EXISTS
      Persons (
          person_id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL
      );
      INSERT INTO Persons (name, email)
      VALUES (${name}, ${email});
    `;
    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
