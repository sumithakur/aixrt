/**
 * The content files the CMS is allowed to read and write, in one place.
 *
 * Both the save endpoint's allowlist and the Firebase sync read this, so a new
 * content file cannot be editable in one and invisible to the other.
 */
export const CONTENT_FILES = [
  'site.json',
  'home.json',
  'about.json',
  'programme.json',
  'roundtables.json',
  'partners.json',
  'showcase.json',
  'venue.json',
  'signals.json',
  'contact.json',
  'faq.json',
  'navigation.json',
  'globals.json',
  'metadata.json',
] as const;

export type ContentFile = (typeof CONTENT_FILES)[number];

export const CONTENT_FILE_SET: ReadonlySet<string> = new Set(CONTENT_FILES);
