import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Section variant="hero" className="pt-12 pb-32 text-center">
      <Container size="narrow">
        <Eyebrow accent="secondary" className="mb-2">
          404 Error
        </Eyebrow>
        <Heading level={1} size="xl" className="mb-4">
          Page Not Found
        </Heading>
        <Standfirst className="mx-auto max-w-md">
          The requested route does not exist or has been relocated within the AIX Summit 2026 structure.
        </Standfirst>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary" size="md">
            Home
          </Button>
          <Button href="/roundtables" variant="secondary" size="md">
            Roundtables
          </Button>
          <Button href="/programme" variant="secondary" size="md">
            Programme
          </Button>
          <Button href="/request-an-invitation" variant="secondary" size="md">
            Request an Invitation
          </Button>
        </div>
      </Container>
    </Section>
  );
}
