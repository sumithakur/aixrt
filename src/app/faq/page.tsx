'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { CTABand } from '@/components/content/CTABand';
import { getFAQs, getFAQDataRaw } from '@/lib/content';
import { ChevronDown, HelpCircle, Link as LinkIcon } from 'lucide-react';

export default function FAQPage() {
  const faqCategories = getFAQs();
  const rawFaq = getFAQDataRaw() || {};
  const hero = rawFaq.hero || {
    eyebrow: 'Knowledge Base & Guidance',
    title: 'Frequently Asked Questions',
    description:
      'Clear answers regarding attendance eligibility, invitation allocations, roundtable governance, Chatham House principles, and partnership models.',
  };
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Auto-expand based on hash in URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setOpenItems((prev) => ({ ...prev, [hash]: true }));
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // FAQPage JSON-LD schema
  const allQuestions = faqCategories.flatMap((cat) => cat.items);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allQuestions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Section variant="hero" className="pt-16 pb-16">
        <Container size="default">
          <div className="max-w-3xl">
            <Eyebrow accent="secondary" className="mb-3">
              {hero.eyebrow}
            </Eyebrow>
            <Heading level={1} size="xl" className="mb-4">
              {hero.title}
            </Heading>
            <Standfirst>
              {hero.description}
            </Standfirst>
          </div>
        </Container>
      </Section>

      <Section variant="raised">
        <Container size="default">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Table of Contents sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-2 rounded-lg border border-border-subtle bg-bg-surface/60 p-6 backdrop-blur-md">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
                  Categories
                </h3>
                <nav className="space-y-1.5 pt-2">
                  {faqCategories.map((cat) => (
                    <a
                      key={cat.category}
                      href={`#cat-${cat.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      className="block text-xs text-text-secondary hover:text-brand-secondary transition-colors"
                    >
                      {cat.category}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Questions list */}
            <div className="space-y-12 lg:col-span-8">
              {faqCategories.map((category) => (
                <div
                  key={category.category}
                  id={`cat-${category.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  className="space-y-4"
                >
                  <h2 className="font-display text-lg font-bold text-brand-secondary border-b border-border-subtle pb-2">
                    {category.category}
                  </h2>

                  <div className="space-y-3">
                    {category.items.map((item) => {
                      const isOpen = !!openItems[item.id];
                      return (
                        <div
                          key={item.id}
                          id={item.id}
                          className="rounded-md border border-border-subtle bg-bg-raised/70 overflow-hidden transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            className="flex w-full items-start justify-between gap-4 p-5 text-left font-display text-base font-bold text-text-primary hover:text-brand-secondary"
                            aria-expanded={isOpen}
                          >
                            <span className="leading-snug">{item.question}</span>
                            <div className="flex items-center gap-2 shrink-0 mt-0.5">
                              <ChevronDown
                                className={`h-4 w-4 text-text-muted transition-transform duration-fast ${
                                  isOpen ? 'rotate-180 text-brand-secondary' : ''
                                }`}
                              />
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-text-secondary border-t border-border-subtle">
                              <p>{item.answer}</p>
                              <div className="mt-3 pt-2">
                                <a
                                  href={`#${item.id}`}
                                  className="inline-flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-brand-secondary"
                                >
                                  <LinkIcon className="h-3 w-3" />
                                  <span>Deep link</span>
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
