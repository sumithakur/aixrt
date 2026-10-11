import { z } from 'zod';

export const invitationRequestSchema = z.object({
  fullName: z.string().min(2, 'Full name is required (minimum 2 characters)'),
  workEmail: z.string().email('Please enter a valid work email address'),
  mobile: z.string().min(6, 'Please enter a valid phone number with country code'),
  country: z.string().min(2, 'Country is required'),
  organisation: z.string().min(2, 'Organisation name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  seniority: z.enum(
    [
      'c-level',
      'managing-director',
      'partner-investor',
      'government-director',
      'head-of-department',
      'founder',
      'other',
    ],
    { required_error: 'Please select your seniority level' }
  ),
  industry: z.string().min(2, 'Please select or enter your industry'),
  orgSize: z.enum(['1-50', '51-250', '251-1000', '1000+'], {
    required_error: 'Please select your organisation size',
  }),
  priority1Roundtable: z.string().min(1, 'Please select your first choice priority'),
  priority2Roundtable: z.string().min(1, 'Please select your second choice priority'),
  priority3Roundtable: z.string().min(1, 'Please select your third choice priority'),
  contribution: z
    .string()
    .min(20, 'Please share at least a sentence on what perspective you would bring (min 20 chars)')
    .max(400, 'Maximum 400 characters allowed'),
  questions: z.string().max(400).optional(),
  confidentialityAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to Chatham House confidentiality rules to participate' }),
  }),
  marketingConsent: z.boolean().default(false),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

export type InvitationRequestData = z.infer<typeof invitationRequestSchema>;
