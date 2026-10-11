import { z } from 'zod';

export const cxoInvitationSchema = z.object({
  applicantType: z.literal('cxo').default('cxo'),
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
  priority1Roundtable: z.string().min(1, 'Please select your Session 1 roundtable choice'),
  priority2Roundtable: z.string().min(1, 'Please select your Session 2 roundtable choice'),
  priority3Roundtable: z.string().optional(),
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

export const startupInvitationSchema = z.object({
  applicantType: z.literal('startup').default('startup'),
  companyName: z.string().min(2, 'Company name is required'),
  website: z.string().url('Please enter a valid website URL (including https://)'),
  fullName: z.string().min(2, 'Contact name is required'),
  jobTitle: z.string().min(2, 'Role / Title is required'),
  workEmail: z.string().email('Please enter a valid work email address'),
  mobile: z.string().min(6, 'Please enter a valid phone number with country code'),
  country: z.string().min(2, 'Headquarters country is required'),
  stage: z.string().min(1, 'Please select company stage'),
  oneLiner: z.string().min(10, 'One-line summary is required (min 10 characters)'),
  problemSolved: z.string().min(20, 'Please describe the enterprise problem solved (min 20 characters)'),
  deploymentsEvidence: z.string().min(20, 'Please provide verified deployment evidence (min 20 characters)'),
  demoDescription: z.string().min(20, 'Please describe your live demo concept (min 20 characters)'),
  hasVideoDemo: z.string().min(1, 'Please select demo video status'),
  roundtableFocus: z.string().min(1, 'Please select the most relevant roundtable lane'),
  confidentialityAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept summit terms to apply' }),
  }),
  marketingConsent: z.boolean().default(false),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

export const invitationRequestSchema = z.discriminatedUnion('applicantType', [
  cxoInvitationSchema,
  startupInvitationSchema,
]);

export type CxoInvitationData = z.infer<typeof cxoInvitationSchema>;
export type StartupInvitationData = z.infer<typeof startupInvitationSchema>;
export type InvitationRequestData = z.infer<typeof invitationRequestSchema>;
