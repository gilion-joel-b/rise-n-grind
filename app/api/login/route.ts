import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    const isSuccessful = await sql`
      SELECT
          CASE WHEN EXISTS 
          (
              SELECT password FROM password WHERE password = ${password}
          )
          THEN 'TRUE'
          ELSE 'FALSE'
      END;
    `;

    const caseValue = isSuccessful.rows[0].case;

    if (caseValue === "FALSE") {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
