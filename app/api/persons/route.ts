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
      INSERT INTO Persons (name, email)
      VALUES (${name}, ${email});
    `;
    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const persons =
      await sql`
    SELECT * FROM Persons
    limit 10;
    `;
    return NextResponse.json(persons.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
