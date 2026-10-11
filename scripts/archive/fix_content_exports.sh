#!/bin/bash
cat << 'INNER' >> src/lib/content.ts

import homeData from '@/content/home.json';
import aboutData from '@/content/about.json';

export function getHomeContent() {
  return homeData;
}

export function getAboutContent() {
  return aboutData;
}
INNER
