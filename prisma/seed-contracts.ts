import type { Prisma } from '../app/generated/prisma/client';

/** Contract rows without `userId` — assigned in `seed.ts`. */
export type SampleContractSeed = Omit<Prisma.ContractCreateManyInput, 'userId'>;

const PARTNERS = [
  'Northwind Trading',
  'Contoso Ltd',
  'Fabrikam Industries',
  'Adventure Works',
  'Litware Inc',
  'Wide World Importers',
  'Tailspin Toys',
  'Blue Yonder Airlines',
  'Woodgrove Bank',
  'Alpine Ski House',
  'Fourth Coffee',
  'Proseware',
  "Margie's Travel",
  'Southridge Video',
  'The Phone Company',
] as const;

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

export const sampleContracts: SampleContractSeed[] = Array.from(
  { length: 45 },
  (_, i) => {
    const now = new Date();
    const partner = PARTNERS[i % PARTNERS.length];
    const batch = Math.floor(i / PARTNERS.length) + 1;
    const signed = i % 3 !== 0;
    const isSent = i % 4 !== 0;
    const deadline = addDays(now, ((i * 7) % 120) - 30);
    const signedDate = signed ? addDays(now, -((i % 50) + 1)) : null;

    return {
      name: `Service Agreement — ${partner} (${batch})`,
      deadline,
      signerName: signed ? `Alex Rivera ${i + 1}` : `Jordan Lee ${i + 1}`,
      signerEmail: `signer${i + 1}@example.com`,
      content: {
        version: 1,
        title: `Master services with ${partner}`,
        clauses: [
          { id: 'scope', summary: 'Deliverables and milestones' },
          { id: 'payment', summary: 'Net 30; late fees as applicable' },
          { id: 'termination', summary: 'Either party may terminate with notice' },
        ],
        body: `This sample agreement covers work between Sine and ${partner} (engagement ${batch}).`,
      },
      signedDate,
      isSent,
      templateId: null,
    };
  },
);
