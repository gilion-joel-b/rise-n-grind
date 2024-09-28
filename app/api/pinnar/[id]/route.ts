import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';


export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const pinnar =
      await sql`
    SELECT * FROM Pinne
    where pinne.pinne_id = ${params.id}
    limit 10;
    `;
    return NextResponse.json(pinnar.rows, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result =
      await sql`
        DELETE FROM Pinne
        WHERE pinne_id = (
          SELECT pinne_id FROM Pinne
          WHERE person_id = ${params.id}
          ORDER BY created_at DESC
          LIMIT 1
        );
    `;
    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
