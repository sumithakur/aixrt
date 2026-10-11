import { NextResponse } from 'next/server';
import { invitationRequestSchema } from '@/lib/schemas/invitation';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side Zod validation
    const result = invitationRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check honeypot
    if (data.honeypot && data.honeypot.length > 0) {
      return NextResponse.json({ success: true, message: 'Received' }, { status: 200 });
    }

    // In production, forward to CRM/Resend/SendGrid/Email
    console.log('[INVITATION REQUEST RECEIVED]', {
      name: data.fullName,
      email: data.workEmail,
      org: data.organisation,
      title: data.jobTitle,
      table1: data.priority1Roundtable, table2: data.priority2Roundtable, table3: data.priority3Roundtable,
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation request successfully submitted for curatorial review.',
    });
  } catch (error) {
    console.error('Error processing invitation request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error processing request' },
      { status: 500 }
    );
  }
}
