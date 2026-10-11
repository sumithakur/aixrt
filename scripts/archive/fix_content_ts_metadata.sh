#!/bin/bash
cat << 'INNER' >> src/lib/content.ts

export function getProgrammeDataRaw() { return programmeData as any; }
export function getRoundtablesDataRaw() { return roundtablesData as any; }
export function getPartnersDataRaw() { return partnersData as any; }
INNER
