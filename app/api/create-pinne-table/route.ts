import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    const result =
      await sql`
    CREATE TABLE IF NOT EXISTS
    Pinne (
        pinne_id SERIAL PRIMARY KEY,
        person_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    `;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
