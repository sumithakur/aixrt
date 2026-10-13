'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { getSiteConfig, getContactData } from '@/lib/content';
import { Mail, CheckCircle2, MessageSquare, Briefcase, Sparkles, Newspaper } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createInstitutionalMessage, fetchContactDepartmentOptions } from '@/store/contact/contactActions';
import { resetInstitutionalMessage } from '@/store/contact/contactSlice';

export default function ContactPage() {
  const config = getSiteConfig();
  const contactData = getContactData();
  const dispatch = useAppDispatch();
  const { departmentOptions, institutionalMessage } = useAppSelector((state) => state.contact);
  const submitted = institutionalMessage.status === 'succeeded';
  const [form, setForm] = useState({
    name: '',
    email: '',
    organisation: '',
    departmentId: '',
    message: '',
  });

  // Load dropdown options
  useEffect(() => {
    if (departmentOptions.status === 'idle') dispatch(fetchContactDepartmentOptions());
  }, [dispatch, departmentOptions.status]);

  // Default the department to the first option once loaded
  useEffect(() => {
    if (!form.departmentId && departmentOptions.data.length > 0) {
      setForm((prev) => ({ ...prev, departmentId: String(departmentOptions.data[0].id) }));
    }
  }, [departmentOptions.data, form.departmentId]);

  // clear submission state when leaving the page
  useEffect(() => {
    return () => {
      dispatch(resetInstitutionalMessage());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createInstitutionalMessage({
        full_name: form.name,
        work_email: form.email,
        organisation: form.organisation,
        department_option_id: Number(form.departmentId),
        message: form.message,
      })
    );
  };

  const contactRoutes = [
    {
      title: 'General Enquiries',
      email: config.contacts.general,
      icon: MessageSquare,
      desc: 'Summit registration, attendance questions, and delegate credentials.',
    },
    {
      title: 'Partnerships & Chairs',
      email: config.contacts.partnerships,
      icon: Briefcase,
      desc: 'Roundtable Chair agreements, strategic co-hosting, and sponsor briefings.',
    },
    {
      title: 'AI Showcase',
      email: config.contacts.showcase,
      icon: Sparkles,
      desc: 'Live demonstration applications, stage logistics, and technical reviews.',
    },
    {
      title: 'Press & Media',
      email: config.contacts.press,
      icon: Newspaper,
      desc: 'Journalist accreditation, press kit requests, and spokesperson interviews.',
    },
  ];

  return (
    <Section variant="hero" className="pt-16 pb-24">
      <Container size="default">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <Eyebrow accent="secondary" className="mb-2">
            Connect with the Summit Team
          </Eyebrow>
          <Heading level={1} size="xl" className="mb-4">
            Contact Organising Team
          </Heading>
          <Standfirst>
            Direct contact routes for delegates, prospective roundtable chairs, demonstration applicants, and media.
          </Standfirst>
        </div>

        {/* Four Routed Channel Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {contactRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <div
                key={route.title}
                className="flex flex-col justify-between rounded-lg border border-border-subtle bg-bg-raised/70 p-6 transition-colors hover:border-border-prominent"
              >
                <div>
                  <Icon className="h-6 w-6 text-brand-secondary mb-3" />
                  <h3 className="font-display text-base font-bold text-text-primary">
                    {route.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {route.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle">
                  <a
                    href={`mailto:${route.email}`}
                    className="text-xs font-mono font-medium text-brand-secondary hover:underline break-all"
                  >
                    {route.email}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto rounded-lg border border-border-subtle bg-bg-raised/80 p-8 sm:p-12 shadow-card backdrop-blur-md">
          <h2 className="font-display text-xl font-bold text-text-primary mb-2">
            Send an Institutional Message
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mb-8">
            Your message will be routed directly to the designated department lead.
          </p>

          {submitted ? (
            <div className="rounded-md bg-status-confirmed/10 p-6 border border-status-confirmed/30 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-status-confirmed mb-2" />
              <p className="text-sm font-semibold text-text-primary">Message transmitted.</p>
              <p className="text-xs text-text-secondary mt-1">
                Our organising team will respond to {form.email} within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-text-primary">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@organisation.com"
                    className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-text-primary">Organisation</label>
                  <input
                    type="text"
                    value={form.organisation}
                    onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                    placeholder="e.g. Ministry / Enterprise"
                    className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="contact-department" className="block text-xs font-semibold text-text-primary">Department / Enquiry Type *</label>
                  <select
                    id="contact-department"
                    required
                    value={form.departmentId}
                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                    disabled={departmentOptions.status === 'loading'}
                    className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
                  >
                    {departmentOptions.data.length === 0 && (
                      <option value="">
                        {departmentOptions.status === 'loading' ? 'Loading…' : 'No options available'}
                      </option>
                    )}
                    {departmentOptions.data.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {departmentOptions.error && (
                    <p className="mt-1 text-xs text-brand-rose">{departmentOptions.error}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can our organising committee assist your organisation?"
                  className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base p-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                />
              </div>

              {institutionalMessage.error && (
                <p className="text-xs text-brand-rose">{institutionalMessage.error}</p>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={institutionalMessage.status === 'loading'}
                >
                  Transmit Message
                </Button>
              </div>
            </form>
          )}

          {/* Organiser Attribution */}
          <div className="mt-10 pt-6 border-t border-border-subtle text-center text-xs text-text-muted">
            <p>
              AIX Summit 2026 is organised by{' '}
              <strong className="text-text-secondary">{config.event.organiser}</strong>.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
