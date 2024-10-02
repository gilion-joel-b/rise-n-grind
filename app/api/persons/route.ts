import { CreatePerson } from '@/app/queries';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, username } = await request.json() satisfies CreatePerson;

  if (!name || !username) {
    return NextResponse.json({ error: 'name and username are required' }, { status: 400 });
  }

  try {
    const result =
      await sql`
        INSERT INTO Persons (username, name)
        SELECT TRIM(${username}), TRIM(${name})
        WHERE NOT EXISTS (
            SELECT 1 FROM Persons WHERE TRIM(LOWER(name)) = TRIM(LOWER(${name}))
              AND TRIM(LOWER(username)) = TRIM(LOWER(${username}))
        )
        RETURNING *;
    `;
    return NextResponse.json({ person: result.rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET(_request: Request) {
  try {
    const persons =
      await sql`
    SELECT * FROM Persons
    limit 10;
    `;
    const pinnar =
      await sql`
    SELECT * FROM Pinne
    WHERE created_at >= date_trunc('month', current_date)
      AND created_at < date_trunc('month', current_date) + interval '1 month';
    `;

    const body = persons.rows.map(person => ({
      person,
      pinnar: pinnar.rows.filter(pinne => pinne.person_id === person.id).length
    }))


    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
