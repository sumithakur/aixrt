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
    if (data.applicantType === 'cxo') {
      console.log('[CXO INVITATION REQUEST RECEIVED]', {
        name: data.fullName,
        email: data.workEmail,
        org: data.organisation,
        title: data.jobTitle,
        table1: data.priority1Roundtable,
        table2: data.priority2Roundtable,
      });
    } else {
      console.log('[STARTUP SHOWCASE APPLICATION RECEIVED]', {
        company: data.companyName,
        contact: data.fullName,
        email: data.workEmail,
        website: data.website,
        stage: data.stage,
        roundtableFocus: data.roundtableFocus,
      });
    }

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
