import { NextResponse } from 'next/server';

export async function GET() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AIX Summit//AIX Summit 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:aix-summit-2026@aixsummit.com',
    'DTSTAMP:20260927T120000Z',
    'DTSTART;TZID=Asia/Qatar:20261214T100000',
    'DTEND;TZID=Asia/Qatar:20261214T180000',
    'SUMMARY:AIX Summit 2026',
    'DESCRIPTION:AIX Summit 2026 — Where AI moves from ambition to action. One-day executive summit in Doha, Qatar featuring six sponsored roundtables and enterprise demonstrations.',
    'LOCATION:Doha, Qatar',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="AIX-Summit-2026.ics"',
    },
  });
}
