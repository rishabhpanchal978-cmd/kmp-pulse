import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, Search, Filter, ShieldCheck, AlertTriangle, Clock, Users,
  Landmark, Database, FileText, Pin, ExternalLink, Sparkles, Download,
  UserCheck, Building, MessageSquare, Info, Printer, Sun, Moon, Layout,
  TrendingUp, Bell, Lock, Unlock, Award, CheckCircle2, ArrowUpRight,
  ArrowDownRight, Eye, ShieldAlert, Briefcase, Layers, Zap, BarChart3
} from 'lucide-react';

// ============================================================================
// 1. SECURITY & SANITIZATION UTILITIES
// ============================================================================

export function sanitizeExternalUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function rowsToSafeCsv(headers, rows) {
  const headerLine = headers.map(sanitizeCsvCell).join(',');
  const bodyLines = rows.map((row) =>
    headers.map((col) => sanitizeCsvCell(row[col])).join(',')
  );
  return [headerLine, ...bodyLines].join('\n');
}

// ============================================================================
// 2. SEED DATASETS: SHARE-PRICE CATALYSTS, GOVERNANCE & KMP 360° PROFILES
// ============================================================================

const INITIAL_COMPANIES = [
  {
    id: 'comp_infy',
    legalName: 'Infosys Limited',
    displayName: 'Infosys',
    cin: 'L85110KA1981PLC013115',
    isin: 'INE009A01021',
    nseSymbol: 'INFY',
    bseCode: '500209',
    sector: 'IT Services & Digital Transformation',
    listingStatus: 'listed',
    currentPrice: 1842.5,
    priceChangePct: 1.34,
    marketCapCr: 765200,
    promoterPct: 14.61,
    promoterPledgePct: 0.0,
    institutionalPct: 68.42,
    governanceScore: 94,
    kmpChurn3Yr: 'Low (1 Planned CFO Transition)',
    basis: 'CONSOLIDATED',
    financials: [
      { fy: 2018, revenueCr: 70522, ebitdaCr: 19010, patCr: 16029, closePrice: 571.2, nifty: 10113 },
      { fy: 2019, revenueCr: 82675, ebitdaCr: 20889, patCr: 15404, closePrice: 743.8, nifty: 11623 },
      { fy: 2020, revenueCr: 90791, ebitdaCr: 22267, patCr: 16594, closePrice: 641.5, nifty: 8597 },
      { fy: 2021, revenueCr: 100472, ebitdaCr: 27889, patCr: 19351, closePrice: 1368.0, nifty: 14690 },
      { fy: 2022, revenueCr: 121641, ebitdaCr: 31491, patCr: 22110, closePrice: 1906.8, nifty: 17464 },
      { fy: 2023, revenueCr: 146767, ebitdaCr: 35130, patCr: 24095, closePrice: 1427.9, nifty: 17359 },
      { fy: 2024, revenueCr: 153670, ebitdaCr: 36425, patCr: 26233, closePrice: 1498.0, nifty: 22326 },
      { fy: 2025, revenueCr: 162990, ebitdaCr: 38910, patCr: 27840, closePrice: 1785.0, nifty: 23519 }
    ],
    catalysts: [
      {
        id: 'cat_infy_1',
        window: 'Q1 FY27 (Next 60 Days)',
        event: 'CEO Second 5-Year Term Succession & Board Nomination Review',
        impactPotential: 'High',
        historicalAnalog: '+4.8% 5D return on orderly CFO succession (Dec 2023)',
        isPro: true,
        provenance: 'Verified'
      },
      {
        id: 'cat_infy_2',
        window: 'Ongoing Capital Allocation',
        event: '85% Free Cash Flow Return Policy (Buyback / Special Dividend Window)',
        impactPotential: 'Elevated',
        historicalAnalog: '+3.1% avg 10D drift post buyback record date announcement',
        isPro: false,
        provenance: 'Verified'
      }
    ],
    governanceRedFlags: [
      { check: 'Promoter Share Pledge', status: 'CLEAN (0.00%)', risk: 'Low', note: 'Zero encumbered promoter shares across all filings.' },
      { check: 'KMP Attrition Velocity (36M)', status: 'STABLE', risk: 'Low', note: 'CFO Nilanjan Roy served full 110-day notice overlap.' },
      { check: 'Related Party Transactions (RPT)', status: '0.4% of Rev', risk: 'Low', note: 'Primarily wholly-owned subsidiary arm’s-length IT delivery.' },
      { check: 'Statutory Auditor Tenure', status: 'Deloitte Haskins', risk: 'Low', note: 'Unqualified audit opinions across FY18–FY25.' }
    ],
    provenance: {
      sourceName: 'Infosys Consolidated Annual Reports FY18–FY25 & NSE Disclosures',
      sourceUrl: 'https://www.infosys.com/investors/reports-filings.html',
      publicationDate: '2025-05-14',
      pageRef: 'Consolidated P&L, Section 4.2',
      lastVerified: '2026-11-18',
      status: 'Verified'
    }
  },
  {
    id: 'comp_lt',
    legalName: 'Larsen & Toubro Limited',
    displayName: 'L&T',
    cin: 'L99999MH1946PLC004768',
    isin: 'INE018A01030',
    nseSymbol: 'LT',
    bseCode: '500510',
    sector: 'Engineering, Procurement & Construction',
    listingStatus: 'listed',
    currentPrice: 3618.0,
    priceChangePct: 0.88,
    marketCapCr: 497400,
    promoterPct: 0.0,
    promoterPledgePct: 0.0,
    institutionalPct: 79.15,
    governanceScore: 91,
    kmpChurn3Yr: 'Very Low (Internal Lifers)',
    basis: 'CONSOLIDATED',
    financials: [
      { fy: 2018, revenueCr: 119862, ebitdaCr: 13571, patCr: 7370, closePrice: 1310.9, nifty: 10113 },
      { fy: 2019, revenueCr: 135220, ebitdaCr: 15329, patCr: 8905, closePrice: 1385.2, nifty: 11623 },
      { fy: 2020, revenueCr: 145452, ebitdaCr: 16329, patCr: 9549, closePrice: 808.5, nifty: 8597 },
      { fy: 2021, revenueCr: 135979, ebitdaCr: 15624, patCr: 11583, closePrice: 1418.9, nifty: 14690 },
      { fy: 2022, revenueCr: 156521, ebitdaCr: 18217, patCr: 8669, closePrice: 1767.6, nifty: 17464 },
      { fy: 2023, revenueCr: 183341, ebitdaCr: 20753, patCr: 10471, closePrice: 2164.2, nifty: 17359 },
      { fy: 2024, revenueCr: 221113, ebitdaCr: 23494, patCr: 13059, closePrice: 3763.9, nifty: 22326 },
      { fy: 2025, revenueCr: 255734, ebitdaCr: 26850, patCr: 15037, closePrice: 3492.0, nifty: 23519 }
    ],
    catalysts: [
      {
        id: 'cat_lt_1',
        window: 'Lakshya 2026 Strategic Plan',
        event: 'Hyderabad Metro Asset Monetization & Non-Core Divestment Closure',
        impactPotential: 'High',
        historicalAnalog: '+6.2% 15D re-rating during prior buyback & asset-light milestone',
        isPro: true,
        provenance: 'Verified'
      }
    ],
    governanceRedFlags: [
      { check: 'Board Structure', status: '100% Professionally Managed', risk: 'Low', note: 'Zero promoter group; institutional board oversight.' },
      { check: 'KMP Attrition Velocity (36M)', status: 'VERY LOW', risk: 'Low', note: 'CMD S. N. Subrahmanyan has 41-year internal tenure.' },
      { check: 'Subsidiary Overlap', status: 'MONITORED', risk: 'Moderate', note: 'CMD chairs listed arms LTIMindtree & LTTS.' }
    ],
    provenance: {
      sourceName: 'L&T Integrated Annual Reports FY18–FY25',
      sourceUrl: 'https://investors.larsentoubro.com/',
      publicationDate: '2025-06-02',
      pageRef: 'Financial Highlights, p. 14',
      lastVerified: '2026-11-18',
      status: 'Verified'
    }
  },
  {
    id: 'comp_axis',
    legalName: 'Axis Bank Limited',
    displayName: 'Axis Bank',
    cin: 'L65110GJ1993PLC020769',
    isin: 'INE238A01034',
    nseSymbol: 'AXISBANK',
    bseCode: '532215',
    sector: 'Private Sector Banking',
    listingStatus: 'listed',
    currentPrice: 1164.2,
    priceChangePct: -0.42,
    marketCapCr: 360100,
    promoterPct: 8.18,
    promoterPledgePct: 0.0,
    institutionalPct: 81.9,
    governanceScore: 88,
    kmpChurn3Yr: 'Moderate (Deputy MD & Retail Head Changes)',
    basis: 'STANDALONE',
    financials: [
      { fy: 2019, revenueCr: 68116, ebitdaCr: 19005, patCr: 4677, closePrice: 777.2, nifty: 11623 },
      { fy: 2020, revenueCr: 78172, ebitdaCr: 23438, patCr: 1627, closePrice: 379.0, nifty: 8597 },
      { fy: 2021, revenueCr: 78483, ebitdaCr: 25702, patCr: 6588, closePrice: 697.4, nifty: 14690 },
      { fy: 2022, revenueCr: 82597, ebitdaCr: 24742, patCr: 13025, closePrice: 761.1, nifty: 17464 },
      { fy: 2023, revenueCr: 101665, ebitdaCr: 32048, patCr: 9580, closePrice: 858.5, nifty: 17359 },
      { fy: 2024, revenueCr: 131810, ebitdaCr: 37123, patCr: 24861, closePrice: 1047.2, nifty: 22326 }
    ],
    catalysts: [
      {
        id: 'cat_axis_1',
        window: 'RBI Regulatory Window',
        event: 'MD & CEO 3-Year Term Extension Effective Milestone (Through Dec 2027)',
        impactPotential: 'Elevated',
        historicalAnalog: '+2.4% 5D reaction upon RBI approval filing (Oct 2024)',
        isPro: true,
        provenance: 'Verified'
      }
    ],
    governanceRedFlags: [
      { check: 'RBI Regulatory Compliance', status: 'APPROVED', risk: 'Low', note: 'RBI approved MD & CEO reappointment without tenure curtailment.' },
      { check: 'Filing Timestamp Alignment', status: 'REVIEW FLAGGED', risk: 'Moderate', note: 'FY19 RBI effective vs. Board taking-on-record timestamp flagged.' }
    ],
    provenance: {
      sourceName: 'Axis Bank Basel III Disclosures & Annual Reports FY19–FY24',
      sourceUrl: 'https://www.axisbank.com/shareholders-corner',
      publicationDate: '2024-05-28',
      pageRef: 'Key Financial Metrics, p. 42',
      lastVerified: '2026-11-15',
      status: 'Corroborated'
    }
  }
];

const INITIAL_KMPS = [
  {
    id: 'kmp_parekh',
    fullLegalName: 'Salil Satish Parekh',
    commonName: 'Salil Parekh',
    din: '01876159',
    companyId: 'comp_infy',
    designation: 'Chief Executive Officer & Managing Director',
    roleArchetype: 'CEO',
    status: 'In-Office',
    strength: 'High',
    appointmentDate: '2018-01-02T09:00:00Z',
    exitDate: null,
    startFy: 2018,
    endFy: 2025,
    headline: 'CEO & MD at Infosys | 30+ Years Global IT Transformation Specialist',
    location: 'Bengaluru, Karnataka, India',
    experienceYears: 32,
    qualifications: ['B.Tech (Aeronautical Engg.), IIT Bombay', 'M.E. (Computer Science & Mechanical Engg.), Cornell University'],
    photoMeta: {
      sourceLabel: 'Official Corporate Bio Placeholder (Copyright-Safe Asset)',
      licenseNote: 'Verified official corporate portrait link pending attribution clearance.'
    },
    verification: {
      status: 'Verified',
      sourceName: 'Infosys BSE/NSE Reg. 30 Appointment Disclosure',
      sourceUrl: 'https://www.bseindia.com/stock-share-price/infosys-ltd/infy/500209/',
      publicationDate: '2017-12-02',
      pageRef: 'Board Outcome Filing, Ref 88/2018',
      lastVerified: '2026-11-18'
    },
    brief30s: {
      mandate: 'Led cloud-first transformation (Infosys Cobalt) and enterprise AI scaling since Jan 2018; reappointed for a second 5-year term through March 2027.',
      financialHighlight: 'Consolidated revenue grew from ₹70,522 Cr (FY18) to ₹1,62,990 Cr (FY25); stock outperformed Nifty 50 over full tenure.',
      governanceNote: 'Reappointment approved by shareholders via Postal Ballot; annual variable pay tied strictly to TSR and operational milestones.'
    },
    careerHistory: [
      {
        company: 'Infosys Limited',
        companyId: 'comp_infy',
        designation: 'Chief Executive Officer & Managing Director',
        from: '2018-01-02',
        to: 'Present',
        departureReason: null,
        summary: 'Spearheaded digital cloud transition; scaled digital revenues from ~25% to over 62% of top line.',
        provenance: { status: 'Verified', sourceName: 'Infosys Annual Report FY25', pageRef: 'Board Profile, p. 54', publicationDate: '2025-05-14' }
      },
      {
        company: 'Capgemini SE',
        companyId: null,
        designation: 'Member of Group Executive Board (North America, UK, Asia)',
        from: '2000-01-01',
        to: '2017-12-31',
        departureReason: 'Resigned to accept CEO & MD role at Infosys Limited',
        summary: 'Oversaw Application Services & Cloud Infrastructure; led integration of iGate acquisition.',
        provenance: { status: 'Corroborated', sourceName: 'Capgemini Universal Registration Document & Infosys AGM Notice 2018', pageRef: 'Item 5 Explanatory Statement', publicationDate: '2018-01-12' }
      },
      {
        company: 'Ernst & Young (EY)',
        companyId: null,
        designation: 'Partner — Technology Consulting Practice',
        from: '1992-06-01',
        to: '2000-01-01',
        departureReason: 'Joined Capgemini upon EY Consulting business unit acquisition',
        summary: 'Advised Fortune 500 manufacturing and financial firms on legacy IT modernization.',
        provenance: { status: 'Reported', sourceName: 'Infosys Official Leadership Biography', pageRef: 'Executive Bios', publicationDate: '2024-04-01' }
      }
    ],
    associations: [
      { entity: 'Infosys Limited', type: 'BOARD_DIRECTOR', role: 'Managing Director & CEO', status: 'Current', provenance: 'Verified' },
      { entity: 'Infosys BPM Limited', type: 'SUBSIDIARY', role: 'Non-Executive Director (Historical)', status: 'Past', provenance: 'Corroborated' },
      { entity: 'US-India Strategic Partnership Forum (USISPF)', type: 'GLOBAL_ADVISORY', role: 'Board Member', status: 'Current', provenance: 'Reported' }
    ],
    shareholdings: [
      { company: 'Infosys Limited', category: 'KMP_DIRECT', shares: 1124560, pct: 0.027, asOf: '2025-03-31', note: 'Includes vested PSUs & RSUs per Annual Report', provenance: 'Verified' },
      { company: 'Other Listed Indian Companies (>1%)', category: 'OTHER_LISTED', shares: null, pct: null, asOf: '2025-03-31', note: 'None disclosed in public exchange filings', provenance: 'Not Available' }
    ],
    remuneration: [
      { fy: 'FY21', fixedCr: 6.72, variableCr: 12.62, perqEsopCr: 30.34, totalCr: 49.68, provenance: 'Verified' },
      { fy: 'FY22', fixedCr: 7.47, variableCr: 12.62, perqEsopCr: 50.95, totalCr: 71.04, provenance: 'Verified' },
      { fy: 'FY23', fixedCr: 7.47, variableCr: 10.60, perqEsopCr: 38.37, totalCr: 56.44, provenance: 'Verified' },
      { fy: 'FY24', fixedCr: 7.47, variableCr: 19.75, perqEsopCr: 39.03, totalCr: 66.25, provenance: 'Verified' },
      { fy: 'FY25', fixedCr: 7.85, variableCr: 21.10, perqEsopCr: 44.20, totalCr: 73.15, provenance: 'Verified' }
    ],
    agreements: [
      {
        type: 'Reappointment Agreement (2022–2027)',
        date: '2022-05-21',
        noticePeriod: '6 months written notice by either party',
        nonCompete: '12-month post-termination covenant covering named global IT peers (TCS, Wipro, Accenture, Cognizant)',
        clawback: 'Subject to Infosys Clawback Policy for gross misstatement or misconduct',
        severance: 'No golden parachute; unvested equity options lapse on voluntary resignation',
        sourceRef: 'Infosys AGM Notice 2022, Explanatory Statement pp. 18–24',
        provenance: 'Verified'
      }
    ],
    publicStatements: [
      {
        date: '2025-04-17',
        outlet: 'Infosys Q4 FY25 Earnings Press Conference',
        title: 'Enterprise AI adoption moving from proof-of-concept to multi-year productivity consolidation',
        url: 'https://www.infosys.com/newsroom/press-releases.html',
        provenance: 'Verified'
      },
      {
        date: '2024-01-18',
        outlet: 'World Economic Forum — Davos Interview',
        title: 'GenAI readiness requires foundational data estate modernization before model scaling',
        url: 'https://www.weforum.org/',
        provenance: 'Reported'
      }
    ]
  },
  {
    id: 'kmp_sns',
    fullLegalName: 'Sekharipuram Narayanan Subrahmanyan',
    commonName: 'S. N. Subrahmanyan',
    din: '02255382',
    companyId: 'comp_lt',
    designation: 'Chairman & Managing Director',
    roleArchetype: 'CEO',
    status: 'In-Office',
    strength: 'Elevated',
    appointmentDate: '2017-07-01T09:00:00Z',
    exitDate: null,
    startFy: 2018,
    endFy: 2025,
    headline: 'Chairman & Managing Director at Larsen & Toubro | EPC Infrastructure Titan',
    location: 'Mumbai, Maharashtra, India',
    experienceYears: 41,
    qualifications: ['B.E. (Civil Engg.), NIT Kurukshetra', 'MBA (Finance), SIBM Pune', 'Executive Management Program, London Business School'],
    photoMeta: {
      sourceLabel: 'Official Corporate Bio Placeholder (Copyright-Safe Asset)',
      licenseNote: 'Verified official corporate portrait link pending attribution clearance.'
    },
    verification: {
      status: 'Verified',
      sourceName: 'L&T BSE/NSE Filing & Annual Report FY24',
      sourceUrl: 'https://www.bseindia.com/stock-share-price/larsen--toubro-ltd/lt/500510/',
      publicationDate: '2023-10-01',
      pageRef: 'Corporate Governance Report, p. 96',
      lastVerified: '2026-11-18'
    },
    brief30s: {
      mandate: 'Appointed CEO & MD in July 2017 and elevated to Chairman & MD in Oct 2023; led asset-light monetization and tech services growth.',
      financialHighlight: 'Consolidated revenue more than doubled from ₹1,19,862 Cr (FY18) to ₹2,55,734 Cr (FY25); record international order inflow.',
      governanceNote: 'Elevated to Chairman & MD upon A. M. Naik stepping down as Non-Executive Chairman on Sept 30, 2023.'
    },
    careerHistory: [
      {
        company: 'Larsen & Toubro Limited',
        companyId: 'comp_lt',
        designation: 'Chairman & Managing Director (MD & CEO 2017–2023; CMD since Oct 2023)',
        from: '1984-08-01',
        to: 'Present',
        departureReason: null,
        summary: 'Joined ECC division in 1984; spearheaded major infrastructure landmark builds (Delhi T3, Statue of Unity, Hyderabad Metro).',
        provenance: { status: 'Verified', sourceName: 'L&T Integrated Annual Report FY25', pageRef: 'Board of Directors, p. 48', publicationDate: '2025-06-02' }
      }
    ],
    associations: [
      { entity: 'Larsen & Toubro Limited', type: 'BOARD_DIRECTOR', role: 'Chairman & Managing Director', status: 'Current', provenance: 'Verified' },
      { entity: 'LTIMindtree Limited', type: 'SUBSIDIARY', role: 'Chairman & Non-Executive Director', status: 'Current', provenance: 'Verified' },
      { entity: 'L&T Technology Services Limited', type: 'SUBSIDIARY', role: 'Chairman & Non-Executive Director', status: 'Current', provenance: 'Verified' }
    ],
    shareholdings: [
      { company: 'Larsen & Toubro Limited', category: 'KMP_DIRECT', shares: 2214890, pct: 0.161, asOf: '2025-03-31', note: 'Direct holding disclosed in Annual Report', provenance: 'Verified' },
      { company: 'LTIMindtree Limited', category: 'SUBSIDIARY_HOLDING', shares: 48500, pct: 0.016, asOf: '2025-03-31', note: 'Disclosed subsidiary director holding', provenance: 'Corroborated' }
    ],
    remuneration: [
      { fy: 'FY21', fixedCr: 4.12, variableCr: 15.80, perqEsopCr: 7.35, totalCr: 27.27, provenance: 'Verified' },
      { fy: 'FY22', fixedCr: 4.35, variableCr: 18.40, perqEsopCr: 38.52, totalCr: 61.27, provenance: 'Verified' },
      { fy: 'FY23', fixedCr: 4.60, variableCr: 21.15, perqEsopCr: 9.92, totalCr: 35.67, provenance: 'Verified' },
      { fy: 'FY24', fixedCr: 5.10, variableCr: 25.40, perqEsopCr: 20.55, totalCr: 51.05, provenance: 'Verified' }
    ],
    agreements: [
      {
        type: 'CMD Elevation & Service Terms',
        date: '2023-10-01',
        noticePeriod: '6 months notice or salary in lieu thereof',
        nonCompete: 'Standard confidentiality & non-solicitation covenants per L&T Service Rules',
        clawback: 'Commission linked strictly to Net Profit u/s 198 of Companies Act, 2013',
        severance: 'Governed by Companies Act, 2013 Section 202 statutory caps',
        sourceRef: 'L&T Annual Report FY24 — Governance Section pp. 112–118',
        provenance: 'Verified'
      }
    ],
    publicStatements: [
      {
        date: '2025-05-08',
        outlet: 'L&T FY25 Results Analyst Meet',
        title: 'Middle East hydrocarbon and green energy capex drove record international order book',
        url: 'https://investors.larsentoubro.com/',
        provenance: 'Verified'
      }
    ]
  },
  {
    id: 'kmp_roy',
    fullLegalName: 'Nilanjan Roy',
    commonName: 'Nilanjan Roy',
    din: '02703775',
    companyId: 'comp_infy',
    designation: 'Former Chief Financial Officer',
    roleArchetype: 'CFO',
    status: 'Former',
    strength: 'Moderate',
    appointmentDate: '2019-03-01T09:00:00Z',
    exitDate: '2024-03-31T18:00:00Z',
    startFy: 2019,
    endFy: 2024,
    headline: 'Former Global CFO at Infosys & Bharti Airtel | Capital Allocation Specialist',
    location: 'Gurugram / Bengaluru, India',
    experienceYears: 29,
    qualifications: ['B.Com (Hons.), Delhi University', 'Chartered Accountant (ICAI)'],
    photoMeta: {
      sourceLabel: 'Official Corporate Bio Placeholder (Copyright-Safe Asset)',
      licenseNote: 'Verified official corporate portrait link pending attribution clearance.'
    },
    verification: {
      status: 'Verified',
      sourceName: 'Infosys Reg. 30 Resignation Disclosure (Dec 2023)',
      sourceUrl: 'https://www.bseindia.com/',
      publicationDate: '2023-12-11',
      pageRef: 'Exchange Filing — KMP Cessation',
      lastVerified: '2026-11-18'
    },
    brief30s: {
      mandate: 'Served as Infosys CFO from March 2019 to March 2024; maintained strict capital allocation policy (85% FCF return) and operating cash discipline.',
      financialHighlight: 'During FY19–FY24 tenure, Infosys PAT expanded from ₹15,404 Cr to ₹26,233 Cr (+11.2% CAGR) with zero long-term debt.',
      governanceNote: 'Resigned Dec 2023 to pursue external opportunities; completed full 110-day handoff through March 31, 2024 to successor Jayesh Sanghrajka.'
    },
    careerHistory: [
      {
        company: 'Infosys Limited',
        companyId: 'comp_infy',
        designation: 'Chief Financial Officer',
        from: '2019-03-01',
        to: '2024-03-31',
        departureReason: 'Resigned to pursue personal aspirations outside the company',
        summary: 'Managed global finance, treasury, tax, M&A integration, and investor relations.',
        provenance: { status: 'Verified', sourceName: 'Infosys Reg. 30 Filing & FY24 Annual Report', pageRef: 'p. 62', publicationDate: '2023-12-11' }
      },
      {
        company: 'Bharti Airtel Limited',
        companyId: null,
        designation: 'Global Chief Financial Officer',
        from: '2006-01-01',
        to: '2019-02-28',
        departureReason: 'Resigned to join Infosys Limited as CFO',
        summary: 'Held senior financial leadership positions across India & Africa business units.',
        provenance: { status: 'Corroborated', sourceName: 'Bharti Airtel & Infosys Press Releases 2018–2019', pageRef: 'Exchange Announcement', publicationDate: '2018-12-14' }
      }
    ],
    associations: [
      { entity: 'Infosys Limited', type: 'KMP_FORMER', role: 'Chief Financial Officer (2019–2024)', status: 'Past', provenance: 'Verified' }
    ],
    shareholdings: [
      { company: 'Infosys Limited', category: 'KMP_DIRECT', shares: 245000, pct: 0.006, asOf: '2024-03-31', note: 'Disclosed as of cessation date', provenance: 'Verified' }
    ],
    remuneration: [
      { fy: 'FY21', fixedCr: 2.15, variableCr: 3.10, perqEsopCr: 4.18, totalCr: 9.43, provenance: 'Verified' },
      { fy: 'FY22', fixedCr: 2.30, variableCr: 3.45, perqEsopCr: 6.12, totalCr: 11.87, provenance: 'Verified' },
      { fy: 'FY23', fixedCr: 2.42, variableCr: 2.85, perqEsopCr: 5.34, totalCr: 10.61, provenance: 'Verified' },
      { fy: 'FY24', fixedCr: 2.50, variableCr: 3.20, perqEsopCr: 7.45, totalCr: 13.15, provenance: 'Verified' }
    ],
    agreements: [
      {
        type: 'CFO Resignation & Transition Terms',
        date: '2023-12-11',
        noticePeriod: 'Served ~110-day transition notice (Dec 11, 2023 to Mar 31, 2024)',
        nonCompete: 'Standard non-disclosure and non-solicitation covenants',
        clawback: 'Subject to Infosys Clawback Policy on variable incentives',
        severance: 'No special severance payout; unvested stock options treated per plan rules',
        sourceRef: 'Infosys Reg. 30 Filing dated Dec 11, 2023',
        provenance: 'Verified'
      }
    ],
    publicStatements: [
      {
        date: '2023-10-12',
        outlet: 'Infosys Q2 FY24 Earnings Call',
        title: 'Project Maximus margin expansion framework driving cost optimization across delivery pyramids',
        url: 'https://www.infosys.com/investors/',
        provenance: 'Verified'
      }
    ]
  },
  {
    id: 'kmp_chaudhry',
    fullLegalName: 'Amitabh Chaudhry',
    commonName: 'Amitabh Chaudhry',
    din: '00531120',
    companyId: 'comp_axis',
    designation: 'Managing Director & Chief Executive Officer',
    roleArchetype: 'CEO',
    status: 'In-Office',
    strength: 'Elevated',
    appointmentDate: '2019-01-01T09:00:00Z',
    exitDate: null,
    startFy: 2019,
    endFy: 2024,
    headline: 'MD & CEO at Axis Bank | Ex-MD & CEO at HDFC Standard Life Insurance',
    location: 'Mumbai, Maharashtra, India',
    experienceYears: 35,
    qualifications: ['B.Tech (Electrical & Electronics), BITS Pilani', 'PGDM, IIM Ahmedabad'],
    photoMeta: {
      sourceLabel: 'Official Corporate Bio Placeholder (Copyright-Safe Asset)',
      licenseNote: 'Verified official corporate portrait link pending attribution clearance.'
    },
    verification: {
      status: 'Unverified',
      sourceName: 'Axis Bank RBI Approval & AGM Notice (Exact effective date flagged for verification)',
      sourceUrl: 'https://www.axisbank.com/shareholders-corner',
      publicationDate: '2018-09-08',
      pageRef: 'Exchange Intimation — RBI Approval',
      lastVerified: '2026-11-10'
    },
    brief30s: {
      mandate: 'Took charge Jan 2019; led asset quality cleanup, Citi India consumer acquisition, and retail deposit expansion.',
      financialHighlight: 'Standalone PAT expanded from ₹4,677 Cr (FY19) to ₹24,861 Cr (FY24); FY25 series pending ingestion.',
      governanceNote: 'Reappointed by RBI and Axis Bank shareholders for a further 3-year term effective Jan 1, 2025.'
    },
    careerHistory: [
      {
        company: 'Axis Bank Limited',
        companyId: 'comp_axis',
        designation: 'Managing Director & Chief Executive Officer',
        from: '2019-01-01',
        to: 'Present',
        departureReason: null,
        summary: 'Led GPS (Growth, Profitability, Sustainability) strategy and integrated Citi India consumer franchise.',
        provenance: { status: 'Corroborated', sourceName: 'Axis Bank Annual Report FY24', pageRef: 'Board Profile, p. 18', publicationDate: '2024-05-28' }
      },
      {
        company: 'HDFC Life Insurance Company Limited',
        companyId: null,
        designation: 'Managing Director & Chief Executive Officer',
        from: '2010-01-01',
        to: '2018-09-08',
        departureReason: 'Resigned upon appointment as MD & CEO of Axis Bank',
        summary: 'Guided HDFC Life through its landmark 2017 IPO and expanded bancassurance partnerships.',
        provenance: { status: 'Verified', sourceName: 'HDFC Life BSE Filing 2018', pageRef: 'Reg. 30 Filing', publicationDate: '2018-09-08' }
      }
    ],
    associations: [
      { entity: 'Axis Bank Limited', type: 'BOARD_DIRECTOR', role: 'MD & CEO', status: 'Current', provenance: 'Verified' },
      { entity: 'Axis Capital Limited', type: 'SUBSIDIARY', role: 'Non-Executive Chairman', status: 'Current', provenance: 'Verified' }
    ],
    shareholdings: [
      { company: 'Axis Bank Limited', category: 'KMP_DIRECT', shares: 1420000, pct: 0.046, asOf: '2024-03-31', note: 'Disclosed in Annual Report', provenance: 'Verified' }
    ],
    remuneration: [
      { fy: 'FY21', fixedCr: 3.25, variableCr: 1.50, perqEsopCr: 1.78, totalCr: 6.53, provenance: 'Verified' },
      { fy: 'FY22', fixedCr: 3.60, variableCr: 2.10, perqEsopCr: 1.92, totalCr: 7.62, provenance: 'Verified' },
      { fy: 'FY23', fixedCr: 3.95, variableCr: 2.65, perqEsopCr: 3.15, totalCr: 9.75, provenance: 'Verified' },
      { fy: 'FY24', fixedCr: 4.30, variableCr: 3.10, perqEsopCr: 4.40, totalCr: 11.80, provenance: 'Verified' }
    ],
    agreements: [
      {
        type: 'RBI-Approved MD & CEO Term Extension',
        date: '2024-10-25',
        noticePeriod: '3 months notice subject to RBI regulatory approval',
        nonCompete: 'Banking secrecy & RBI fit-and-proper governance norms',
        clawback: 'Subject to RBI Guidelines on Compensation of WTDs / CEOs (malus & clawback provisions)',
        severance: 'Governed by Banking Regulation Act & RBI approval',
        sourceRef: 'Axis Bank Reg. 30 Disclosure 2024',
        provenance: 'Verified'
      }
    ],
    publicStatements: [
      {
        date: '2024-04-24',
        outlet: 'Axis Bank Q4 FY24 Media Briefing',
        title: 'Citibank consumer integration completed ahead of schedule with strong deposit retention',
        url: 'https://www.axisbank.com/media-center',
        provenance: 'Verified'
      }
    ]
  }
];

const INITIAL_MOVEMENTS = [
  {
    id: 'mov_1',
    type: 'REAPPOINTMENT',
    executiveId: 'kmp_chaudhry',
    executiveName: 'Amitabh Chaudhry',
    companyName: 'Axis Bank Limited',
    ticker: 'AXISBANK',
    prevRole: 'MD & CEO',
    newRole: 'MD & CEO (3-Year Term Extension)',
    announcedDate: '2024-10-25',
    effectiveDate: '2025-01-01',
    reason: 'RBI statutory re-approval received for MD & CEO extension through Dec 31, 2027',
    stockReaction5d: '+2.4%',
    stockReaction30d: '+5.1%',
    sourceRef: 'NSE/BSE Reg. 30 Disclosure',
    provenance: 'Verified',
    strength: 'Elevated'
  },
  {
    id: 'mov_2',
    type: 'RESIGNATION',
    executiveId: 'kmp_roy',
    executiveName: 'Nilanjan Roy',
    companyName: 'Infosys Limited',
    ticker: 'INFY',
    prevRole: 'Chief Financial Officer',
    newRole: 'Ceased to be CFO (Transitioned to Jayesh Sanghrajka)',
    announcedDate: '2023-12-11',
    effectiveDate: '2024-03-31',
    reason: 'Resigned to pursue personal aspirations outside the company; completed 110-day handoff',
    stockReaction5d: '+4.8%',
    stockReaction30d: '+7.9%',
    sourceRef: 'Infosys Reg. 30 Disclosure (Dec 11, 2023)',
    provenance: 'Verified',
    strength: 'Moderate'
  },
  {
    id: 'mov_3',
    type: 'ELEVATION',
    executiveId: 'kmp_sns',
    executiveName: 'S. N. Subrahmanyan',
    companyName: 'Larsen & Toubro Limited',
    ticker: 'LT',
    prevRole: 'Managing Director & CEO',
    newRole: 'Chairman & Managing Director',
    announcedDate: '2023-05-10',
    effectiveDate: '2023-10-01',
    reason: 'Elevated to CMD following A. M. Naik stepping down as Non-Executive Chairman',
    stockReaction5d: '+1.9%',
    stockReaction30d: '+14.2%',
    sourceRef: 'L&T Board Outcome Filing',
    provenance: 'Verified',
    strength: 'High'
  }
];

const INSIDER_DEAL_FEED = [
  {
    id: 'ins_1',
    date: '2025-03-14',
    ticker: 'INFY',
    company: 'Infosys Limited',
    person: 'Salil Parekh (CEO & MD)',
    category: 'ESOP / RSU Exercise & Retention',
    mode: 'ESOP Allotment (Reg. 7(2) PIT)',
    valueCr: 18.4,
    postHoldingPct: '0.027%',
    signalInterpretation: 'Neutral / Scheduled Vesting — Zero open-market sale',
    provenance: 'Verified'
  },
  {
    id: 'ins_2',
    date: '2025-02-28',
    ticker: 'LT',
    company: 'Larsen & Toubro Limited',
    person: 'Institutional Block (FII Sovereign)',
    category: 'Institutional Block Deal',
    mode: 'NSE Bulk/Block Window',
    valueCr: 412.5,
    postHoldingPct: '79.15% Inst.',
    signalInterpretation: 'Accumulation — Absorbed at 0.4% premium to VWAP',
    provenance: 'Corroborated'
  },
  {
    id: 'ins_3',
    date: '2025-01-19',
    ticker: 'AXISBANK',
    company: 'Axis Bank Limited',
    person: 'Bain Capital (BC Asia Investments)',
    category: 'PE Residual Clean-out Block',
    mode: 'Secondary Block Sale',
    valueCr: 1290.0,
    postHoldingPct: '0.00% (Exit)',
    signalInterpretation: 'Supply Overhang Cleared — Domestic MFs absorbed 82% of block',
    provenance: 'Verified'
  }
];

const EXIT_RADAR_SIGNALS = [
  {
    id: 'rad_1',
    signalType: 'ORDERLY_SUCCESSION',
    severity: 'LOW / ORDERLY',
    company: 'Infosys Limited (INFY)',
    headline: 'CFO Transition (Nilanjan Roy → Jayesh Sanghrajka) with 110-day handoff',
    detail: 'Internal Deputy CFO elevated with full quarter overlap; zero abrupt governance gap.',
    disclaimer: 'Research signal only — orderly internal succession, not an indicator of distress.',
    provenance: 'Verified',
    strength: 'Moderate'
  },
  {
    id: 'rad_2',
    signalType: 'DATE_VERIFICATION_GAP',
    severity: 'REVIEW NEEDED',
    company: 'Axis Bank Limited (AXISBANK)',
    headline: 'Appointment effective timestamp flagged for primary filing cross-check',
    detail: 'Confirm exact RBI effective date vs. board taking-on-record timestamp in FY19 filing.',
    disclaimer: 'Metadata quality alert — not a governance or compliance issue.',
    provenance: 'Unverified',
    strength: 'Low'
  }
];

// ============================================================================
// 3. FINANCIAL MATH & TENURE CALCULATORS
// ============================================================================

function calcCagr(startVal, endVal, years) {
  if (!startVal || !endVal || startVal <= 0 || endVal <= 0 || years <= 0) return null;
  return (Math.pow(endVal / startVal, 1 / years) - 1) * 100;
}

function calcTotalReturn(startVal, endVal) {
  if (!startVal || !endVal || startVal <= 0) return null;
  return ((endVal - startVal) / startVal) * 100;
}

function formatTenure(startIso, endIso, nowMs) {
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : nowMs;
  const diffSec = Math.max(0, Math.floor((end - start) / 1000));
  const years = Math.floor(diffSec / (365.25 * 86400));
  const remAfterYears = diffSec - Math.floor(years * 365.25 * 86400);
  const days = Math.floor(remAfterYears / 86400);
  const hours = Math.floor((remAfterYears % 86400) / 3600);
  const minutes = Math.floor((remAfterYears % 3600) / 60);
  const seconds = remAfterYears % 60;
  return { years, days, hours, minutes, seconds, totalYearsFloat: diffSec / (365.25 * 86400) };
}

// ============================================================================
// 4. DESIGN SYSTEM TOKENS & PRESENTATION COMPONENTS
// ============================================================================

function StrengthBars({ strength = 'Moderate', showLabel = true, skinMode = 'AFTER_LIGHT' }) {
  const barsCount = { Low: 1, Moderate: 2, Elevated: 3, High: 4 }[strength] || 2;
  const accentColor = skinMode === 'BEFORE_SLATE' ? '#38bdf8' : '#12B886';
  const neutralColor = skinMode === 'BEFORE_SLATE' ? '#334155' : (skinMode === 'AFTER_DARK' ? '#2A2F3A' : '#E3E6EA');
  const textColor = skinMode === 'BEFORE_SLATE' ? '#94a3b8' : 'var(--muted, #5B6270)';

  return (
    <div className="inline-flex items-center gap-1.5" title={`Signal Strength: ${strength}`}>
      <div className="flex items-end gap-0.5 h-3.5">
        {[1, 2, 3, 4].map((barNum) => {
          const heightPx = 3.5 + barNum * 2.5;
          const isActive = barNum <= barsCount;
          return (
            <span
              key={barNum}
              style={{
                width: '3.5px',
                height: `${heightPx}px`,
                backgroundColor: isActive ? accentColor : neutralColor,
                borderRadius: '1px'
              }}
              className="transition-all duration-200"
            />
          );
        })}
      </div>
      {showLabel && (
        <span className="text-[11px] font-medium tracking-tight" style={{ color: textColor }}>
          {strength}
        </span>
      )}
    </div>
  );
}

function VerificationBadge({ status = 'Unverified', onInspect, meta, skinMode = 'AFTER_LIGHT' }) {
  let badgeStyle = '';

  if (skinMode === 'BEFORE_SLATE') {
    const slateStyles = {
      Verified: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      Corroborated: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
      Reported: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
      Estimated: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      Unverified: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
      'Not Available': 'bg-slate-700/50 text-slate-400 border-slate-600'
    };
    badgeStyle = slateStyles[status] || slateStyles['Unverified'];
  } else if (skinMode === 'AFTER_DARK') {
    const darkStyles = {
      Verified: 'bg-[#12362B] text-[#7CE3B8] border-[#12B886]/40',
      Corroborated: 'bg-[#1C2547] text-[#A9BBFF] border-[#2B3FA8]/40',
      Reported: 'bg-[#3A2F0B] text-[#FFD966] border-[#7A4D00]/40',
      Estimated: 'bg-[#3A2F0B] text-[#FFD966] border-[#7A4D00]/40',
      Unverified: 'bg-[#1A1D24] text-[#9AA3B2] border-[#2A2F3A]',
      'Not Available': 'bg-[#1A1D24] text-[#9AA3B2] border-[#2A2F3A]'
    };
    badgeStyle = darkStyles[status] || darkStyles['Unverified'];
  } else {
    const lightStyles = {
      Verified: 'bg-[#D3F9E8] text-[#08684B] border-[#12B886]/30',
      Corroborated: 'bg-[#DBE4FF] text-[#2B3FA8] border-[#2B3FA8]/20',
      Reported: 'bg-[#FFF3BF] text-[#7A4D00] border-[#7A4D00]/20',
      Estimated: 'bg-[#FFF3BF] text-[#7A4D00] border-[#7A4D00]/20',
      Unverified: 'bg-[#F3F5F7] text-[#5B6270] border-[#E3E6EA]',
      'Not Available': 'bg-[#F3F5F7] text-[#5B6270] border-[#E3E6EA]'
    };
    badgeStyle = lightStyles[status] || lightStyles['Unverified'];
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onInspect) onInspect({ status, ...(meta || {}) });
      }}
      title="Click to inspect source provenance & filing details"
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition hover:opacity-90 cursor-pointer ${badgeStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </button>
  );
}

function NoteStrip({ text, skinMode = 'AFTER_LIGHT' }) {
  const defaultText =
    text ||
    'Research lead from public exchange filings (SEBI LODR Reg. 30 / PIT). Not investment advice; share-price catalysts indicate historical statistical analogs, not guaranteed returns.';

  if (skinMode === 'BEFORE_SLATE') {
    return (
      <div className="bg-slate-900/90 border border-slate-800 text-slate-400 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 font-mono">
        <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span>{defaultText}</span>
      </div>
    );
  }

  return (
    <div
      className="text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 border transition-colors"
      style={{
        backgroundColor: 'var(--surface, #F3F5F7)',
        borderColor: 'var(--border, #E3E6EA)',
        color: 'var(--muted, #5B6270)'
      }}
    >
      <Info className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent, #087F5B)' }} />
      <span>{defaultText}</span>
    </div>
  );
}

function SafeExternalLink({ url, label, className = 'hover:underline inline-flex items-center gap-1 font-medium' }) {
  const safeHref = sanitizeExternalUrl(url);
  if (!safeHref) {
    return <span className="text-slate-400 text-xs">Source link unavailable</span>;
  }
  return (
    <a href={safeHref} target="_blank" rel="noopener noreferrer" className={className} style={{ color: 'var(--accent, #087F5B)' }}>
      {label} <ExternalLink className="w-3 h-3" />
    </a>
  );
}

function WhatIfImpactChart({ financials, originalStartFy, simStartFy, endFy, skinMode = 'AFTER_LIGHT' }) {
  if (!financials || financials.length < 2) {
    return <div className="p-6 text-sm text-slate-400 bg-slate-900/60 rounded-lg border border-slate-800">Insufficient financial series to render chart.</div>;
  }

  const width = 680;
  const height = 240;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const baseIdx = Math.max(0, financials.findIndex((d) => d.fy === simStartFy));
  const baseRev = financials[baseIdx]?.revenueCr || financials[0].revenueCr;
  const baseStock = financials[baseIdx]?.closePrice || financials[0].closePrice;
  const baseNifty = financials[baseIdx]?.nifty || financials[0].nifty;

  const indexed = financials.map((d, idx) => ({
    fy: d.fy,
    idx,
    revIdx: baseRev ? (d.revenueCr / baseRev) * 100 : 100,
    stockIdx: baseStock ? (d.closePrice / baseStock) * 100 : 100,
    niftyIdx: baseNifty ? (d.nifty / baseNifty) * 100 : 100
  }));

  const allVals = indexed.flatMap((d) => [d.revIdx, d.stockIdx, d.niftyIdx]);
  const minV = Math.min(...allVals) * 0.9;
  const maxV = Math.max(...allVals) * 1.08;

  const xPos = (i) => padL + (i / Math.max(1, indexed.length - 1)) * plotW;
  const yPos = (v) => padT + plotH - ((v - minV) / Math.max(1, maxV - minV)) * plotH;

  const makePath = (key) =>
    indexed.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)} ${yPos(d[key]).toFixed(1)}`).join(' ');

  const simStartX = xPos(baseIdx);
  const endIdx = financials.findIndex((d) => d.fy === endFy);
  const simEndX = xPos(endIdx >= 0 ? endIdx : indexed.length - 1);

  const isSlate = skinMode === 'BEFORE_SLATE';

  return (
    <div
      className="border rounded-xl p-4 transition-colors"
      style={{
        backgroundColor: isSlate ? 'rgba(2, 6, 23, 0.8)' : 'var(--surface, #F3F5F7)',
        borderColor: isSlate ? '#1e293b' : 'var(--border, #E3E6EA)'
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: isSlate ? '#cbd5e1' : 'var(--text, #1B1E25)' }}>
          Rebased Performance Trajectory (FY{simStartFy} = 100)
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 font-medium" style={{ color: '#12B886' }}>
            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#12B886' }} /> Revenue Index
          </span>
          <span className="flex items-center gap-1.5 font-medium" style={{ color: '#0284c7' }}>
            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#0284c7' }} /> Stock Price Index
          </span>
          <span className="flex items-center gap-1.5 font-medium" style={{ color: '#b45309' }}>
            <span className="w-3 h-0.5 inline-block border-dashed border-b" style={{ borderColor: '#b45309' }} /> Nifty 50 Index
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 overflow-visible">
        {simEndX > simStartX && (
          <rect
            x={simStartX}
            y={padT}
            width={simEndX - simStartX}
            height={plotH}
            fill="rgba(18, 184, 134, 0.08)"
            stroke="rgba(18, 184, 134, 0.3)"
            strokeDasharray="3 3"
          />
        )}

        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const val = minV + t * (maxV - minV);
          const y = yPos(val);
          return (
            <g key={t}>
              <line x1={padL} y1={y} x2={width - padR} y2={y} stroke={isSlate ? '#1e293b' : '#e2e8f0'} strokeWidth="1" />
              <text x={padL - 8} y={y + 4} textAnchor="end" className="text-[10px] font-mono" fill={isSlate ? '#64748b' : '#94a3b8'}>
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        <line
          x1={padL}
          y1={yPos(100)}
          x2={width - padR}
          y2={yPos(100)}
          stroke={isSlate ? '#475569' : '#cbd5e1'}
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        <path d={makePath('niftyIdx')} fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="4 3" />
        <path d={makePath('revIdx')} fill="none" stroke="#12B886" strokeWidth="2.5" />
        <path d={makePath('stockIdx')} fill="none" stroke="#0284c7" strokeWidth="2.5" />

        {indexed.map((d, i) => (
          <g key={d.fy}>
            <circle cx={xPos(i)} cy={yPos(d.revIdx)} r="3" fill="#12B886" />
            <circle cx={xPos(i)} cy={yPos(d.stockIdx)} r="3" fill="#0284c7" />
            <text
              x={xPos(i)}
              y={height - 10}
              textAnchor="middle"
              className={`text-[10px] font-mono ${
                d.fy === simStartFy
                  ? 'font-bold fill-emerald-600'
                  : d.fy === originalStartFy
                  ? 'fill-sky-600'
                  : 'fill-slate-400'
              }`}
            >
              FY{String(d.fy).slice(-2)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ============================================================================
// 5. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  const [skinMode, setSkinMode] = useState('AFTER_LIGHT');
  // Subscription tier toggle: 'PRO' (unlocked recurring institutional view) vs 'FREE' (preview with paywall teasers)
  const [subscriptionTier, setSubscriptionTier] = useState('PRO');
  const [showPricingModal, setShowPricingModal] = useState(false);

  const [companies, setCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem('kmp_pulse_v3_companies');
      return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
    } catch {
      return INITIAL_COMPANIES;
    }
  });

  const [kmps, setKmps] = useState(() => {
    try {
      const saved = localStorage.getItem('kmp_pulse_v3_kmps');
      return saved ? JSON.parse(saved) : INITIAL_KMPS;
    } catch {
      return INITIAL_KMPS;
    }
  });

  const [movements] = useState(INITIAL_MOVEMENTS);
  const [nowMs, setNowMs] = useState(Date.now());
  const [activeNav, setActiveNav] = useState('command');
  const [selectedKmpId, setSelectedKmpId] = useState(INITIAL_KMPS[0].id);
  const [selectedCompanyId, setSelectedCompanyId] = useState(INITIAL_COMPANIES[0].id);
  const [profileTab, setProfileTab] = useState('overview');
  const [pinnedIds, setPinnedIds] = useState(['kmp_parekh', 'kmp_sns']);
  const [showCompare, setShowCompare] = useState(false);

  // Watchlist Alert Subscriptions (Recurring value stickiness)
  const [alertSubscriptions, setAlertSubscriptions] = useState(['comp_infy', 'comp_lt']);
  const [toastMsg, setToastMsg] = useState(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('TENURE_DESC');

  // Interactive Simulators
  const [simStartFy, setSimStartFy] = useState(null);
  const [marketBetaWeight, setMarketBetaWeight] = useState(40);
  const [predecessorWeight, setPredecessorWeight] = useState(25);

  // Provenance Inspector Modal
  const [inspectedProvenance, setInspectedProvenance] = useState(null);

  // AI Research Assistant Drawer
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiHistory, setAiHistory] = useState([]);

  // Data Console State
  const [importPayload, setImportPayload] = useState('');
  const [importFeedback, setImportFeedback] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('kmp_pulse_v3_companies', JSON.stringify(companies));
      localStorage.setItem('kmp_pulse_v3_kmps', JSON.stringify(kmps));
    } catch {
      // Storage quota resilience
    }
  }, [companies, kmps]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const toggleWatchlistAlert = (companyId, companyName) => {
    setAlertSubscriptions((prev) => {
      const exists = prev.includes(companyId);
      if (exists) {
        triggerToast(`Paused real-time Reg. 30 & Insider alerts for ${companyName}`);
        return prev.filter((id) => id !== companyId);
      } else {
        triggerToast(`Subscribed to instant Reg. 30, KMP Exit & Block Deal alerts for ${companyName}`);
        return [...prev, companyId];
      }
    });
  };

  const companyMap = useMemo(() => {
    const m = {};
    companies.forEach((c) => {
      m[c.id] = c;
    });
    return m;
  }, [companies]);

  const selectedKmp = useMemo(
    () => kmps.find((k) => k.id === selectedKmpId) || kmps[0],
    [kmps, selectedKmpId]
  );

  const selectedCompany = useMemo(
    () => companyMap[selectedKmp?.companyId] || companies[0],
    [companyMap, selectedKmp, companies]
  );

  useEffect(() => {
    if (selectedKmp) {
      setSimStartFy(selectedKmp.startFy);
    }
  }, [selectedKmp?.id]);

  const computeKmpMetrics = (kmp, overrideStartFy = null) => {
    const comp = companyMap[kmp.companyId];
    const tenure = formatTenure(kmp.appointmentDate, kmp.exitDate, nowMs);
    if (!comp || !comp.financials || comp.financials.length < 2) {
      return { tenure, revCagr: null, patCagr: null, stockReturn: null, niftyReturn: null, alpha: null, yearsSpan: 0 };
    }
    const startFy = overrideStartFy || kmp.startFy;
    const endFy = kmp.endFy || comp.financials[comp.financials.length - 1].fy;
    const startRow = comp.financials.find((f) => f.fy === startFy) || comp.financials[0];
    const endRow = comp.financials.find((f) => f.fy === endFy) || comp.financials[comp.financials.length - 1];
    const yearsSpan = Math.max(1, endRow.fy - startRow.fy);

    const revCagr = calcCagr(startRow.revenueCr, endRow.revenueCr, yearsSpan);
    const patCagr = calcCagr(startRow.patCr, endRow.patCr, yearsSpan);
    const stockReturn = calcTotalReturn(startRow.closePrice, endRow.closePrice);
    const niftyReturn = calcTotalReturn(startRow.nifty, endRow.nifty);
    const alpha = stockReturn !== null && niftyReturn !== null ? stockReturn - niftyReturn : null;

    return { tenure, revCagr, patCagr, stockReturn, niftyReturn, alpha, yearsSpan, startRow, endRow };
  };

  const filteredKmps = useMemo(() => {
    return kmps
      .filter((k) => {
        if (statusFilter !== 'ALL' && k.status !== statusFilter) return false;
        if (companyFilter !== 'ALL' && k.companyId !== companyFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const comp = companyMap[k.companyId];
          const match =
            k.fullLegalName.toLowerCase().includes(q) ||
            k.commonName.toLowerCase().includes(q) ||
            k.din.toLowerCase().includes(q) ||
            k.designation.toLowerCase().includes(q) ||
            (comp && (comp.displayName.toLowerCase().includes(q) || comp.nseSymbol.toLowerCase().includes(q)));
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const ma = computeKmpMetrics(a);
        const mb = computeKmpMetrics(b);
        if (sortBy === 'TENURE_DESC') return mb.tenure.totalYearsFloat - ma.tenure.totalYearsFloat;
        if (sortBy === 'REV_CAGR_DESC') return (mb.revCagr ?? -999) - (ma.revCagr ?? -999);
        if (sortBy === 'ALPHA_DESC') return (mb.alpha ?? -999) - (ma.alpha ?? -999);
        if (sortBy === 'NEWEST') return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
        return 0;
      });
  }, [kmps, statusFilter, companyFilter, searchQuery, sortBy, companyMap, nowMs]);

  const togglePin = (id) => {
    setPinnedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const handleExportSafeCsv = () => {
    const headers = ['id', 'commonName', 'fullLegalName', 'din', 'designation', 'status', 'companyId', 'startFy', 'endFy'];
    const csvContent = rowsToSafeCsv(headers, kmps);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `KMP_Pulse_Pro_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Exported injection-sanitized CSV dataset.');
  };

  const runGroundedQuery = (questionText) => {
    const q = (questionText || aiPrompt).trim();
    if (!q || !selectedKmp) return;
    const lower = q.toLowerCase();
    const comp = selectedCompany;
    const metrics = computeKmpMetrics(selectedKmp);

    let answer = '';
    let citations = [];

    if (lower.includes('catalyst') || lower.includes('share price') || lower.includes('governance')) {
      answer = `Share-Price Catalysts & Governance Audit for ${comp?.displayName} (${comp?.nseSymbol}):\n` +
        `• Governance Integrity Score: ${comp?.governanceScore}/100 (${comp?.kmpChurn3Yr})\n` +
        (comp?.catalysts || []).map((c) => `• [${c.window}] ${c.event} — Historical Analog: ${c.historicalAnalog}`).join('\n');
      citations = [`${comp?.provenance?.sourceName} [${comp?.provenance?.status}]`];
    } else if (lower.includes('career') || lower.includes('previous') || lower.includes('companies')) {
      answer = `${selectedKmp.fullLegalName} (DIN: ${selectedKmp.din}) has ${selectedKmp.careerHistory.length} documented career stints in verified records:\n` +
        selectedKmp.careerHistory
          .map((c, idx) => `${idx + 1}. ${c.designation} at ${c.company} (${c.from} to ${c.to}). ${c.departureReason ? `Disclosed exit reason: ${c.departureReason}.` : ''}`)
          .join('\n');
      citations = selectedKmp.careerHistory.map((c) => `${c.provenance.sourceName} (${c.provenance.pageRef}, ${c.provenance.publicationDate}) [${c.provenance.status}]`);
    } else if (lower.includes('remuneration') || lower.includes('pay') || lower.includes('esop')) {
      if (!selectedKmp.remuneration?.length) {
        answer = 'Not found in verified records: No historical remuneration schedule is loaded for this executive.';
      } else {
        answer = `Disclosed annual remuneration for ${selectedKmp.commonName} at ${comp?.displayName}:\n` +
          selectedKmp.remuneration
            .map((r) => `• ${r.fy}: Total ₹${r.totalCr.toFixed(2)} Cr (Fixed ₹${r.fixedCr.toFixed(2)} Cr, Variable ₹${r.variableCr.toFixed(2)} Cr, Perquisites/ESOPs ₹${r.perqEsopCr.toFixed(2)} Cr).`)
            .join('\n');
        citations = [`${comp?.displayName} Annual Reports (${selectedKmp.remuneration.map((r) => r.fy).join(', ')}) [Verified]`];
      }
    } else if (lower.includes('financial') || lower.includes('performance') || lower.includes('impact')) {
      answer = `Observed financial metrics during ${selectedKmp.commonName}'s ${comp?.displayName} tenure (FY${selectedKmp.startFy}–FY${selectedKmp.endFy}, ${comp?.basis} basis):\n` +
        `• Revenue CAGR: ${metrics.revCagr !== null ? metrics.revCagr.toFixed(1) + '%' : 'Not Available'}\n` +
        `• PAT CAGR: ${metrics.patCagr !== null ? metrics.patCagr.toFixed(1) + '%' : 'Not Available'}\n` +
        `• Stock Return vs. Nifty 50: ${metrics.stockReturn !== null ? metrics.stockReturn.toFixed(1) + '%' : 'N/A'} vs. ${metrics.niftyReturn !== null ? metrics.niftyReturn.toFixed(1) + '%' : 'N/A'}.\n` +
        `Note: Observed correlation across tenure window; macro/sector cycles and predecessor carryover also apply.`;
      citations = [`${comp?.provenance?.sourceName} (${comp?.provenance?.pageRef}) [${comp?.provenance?.status}]`];
    } else if (lower.includes('resign') || lower.includes('agreement') || lower.includes('clause') || lower.includes('sign')) {
      if (!selectedKmp.agreements?.length) {
        answer = 'Not found in verified records: No joining or exit agreement disclosures are currently indexed.';
      } else {
        const ag = selectedKmp.agreements[0];
        answer = `Disclosed contractual/governance terms (${ag.type}, dated ${ag.date}):\n` +
          `• Notice Period: ${ag.noticePeriod}\n` +
          `• Non-Compete / Covenants: ${ag.nonCompete}\n` +
          `• Clawback / Malus: ${ag.clawback}\n` +
          `• Severance: ${ag.severance}`;
        citations = [`${ag.sourceRef} [${ag.provenance}]`];
      }
    } else {
      answer = `Summary from verified records for ${selectedKmp.fullLegalName} (DIN: ${selectedKmp.din}): ${selectedKmp.brief30s.mandate} ${selectedKmp.brief30s.governanceNote}`;
      citations = [`${selectedKmp.verification.sourceName} (${selectedKmp.verification.pageRef}) [${selectedKmp.verification.status}]`];
    }

    setAiHistory((prev) => [{ question: q, answer, citations, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    setAiPrompt('');
  };

  const handleValidateAndImport = () => {
    const raw = importPayload.trim();
    if (!raw) {
      setImportFeedback({ ok: false, message: 'Paste JSON or CSV payload before importing.' });
      return;
    }
    try {
      if (raw.startsWith('{') || raw.startsWith('[')) {
        const parsed = JSON.parse(raw);
        if (parsed.companies && Array.isArray(parsed.companies)) {
          setCompanies((prev) => {
            const byId = new Map(prev.map((c) => [c.id, c]));
            parsed.companies.forEach((c) => {
              if (!c.id || !c.displayName) throw new Error('Each company object requires "id" and "displayName".');
              byId.set(c.id, { ...byId.get(c.id), ...c });
            });
            return Array.from(byId.values());
          });
        }
        if (parsed.kmps && Array.isArray(parsed.kmps)) {
          setKmps((prev) => {
            const byId = new Map(prev.map((k) => [k.id, k]));
            parsed.kmps.forEach((k) => {
              if (!k.id || !k.commonName || !k.companyId) {
                throw new Error('Each KMP object requires "id", "commonName", and "companyId".');
              }
              byId.set(k.id, { ...byId.get(k.id), ...k });
            });
            return Array.from(byId.values());
          });
        }
        if (!parsed.companies && !parsed.kmps) {
          throw new Error('JSON root must contain a "companies" array and/or "kmps" array.');
        }
        setImportFeedback({
          ok: true,
          message: `Validated and merged ${parsed.companies?.length || 0} company record(s) and ${parsed.kmps?.length || 0} KMP profile(s) into browser state.`
        });
      } else {
        const lines = raw.split(/\r?\n/).filter(Boolean);
        const headers = lines[0].split(',').map((h) => h.trim());
        const required = ['companyId', 'fy', 'revenueCr', 'patCr'];
        const missing = required.filter((r) => !headers.includes(r));
        if (missing.length) {
          throw new Error(`CSV missing required columns: ${missing.join(', ')}`);
        }
        let rowsMerged = 0;
        const grouped = {};
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim());
          const rowObj = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cols[idx];
          });
          const cid = rowObj.companyId;
          if (!grouped[cid]) grouped[cid] = [];
          grouped[cid].push({
            fy: Number(rowObj.fy),
            revenueCr: Number(rowObj.revenueCr),
            ebitdaCr: Number(rowObj.ebitdaCr || 0),
            patCr: Number(rowObj.patCr),
            closePrice: Number(rowObj.closePrice || 0),
            nifty: Number(rowObj.nifty || 0)
          });
          rowsMerged++;
        }
        setCompanies((prev) =>
          prev.map((c) => {
            if (!grouped[c.id]) return c;
            const mergedFin = [...c.financials];
            grouped[c.id].forEach((newRow) => {
              const idx = mergedFin.findIndex((f) => f.fy === newRow.fy);
              if (idx >= 0) mergedFin[idx] = { ...mergedFin[idx], ...newRow };
              else mergedFin.push(newRow);
            });
            mergedFin.sort((a, b) => a.fy - b.fy);
            return { ...c, financials: mergedFin };
          })
        );
        setImportFeedback({ ok: true, message: `Validated and merged ${rowsMerged} fiscal-year CSV row(s).` });
      }
    } catch (err) {
      setImportFeedback({ ok: false, message: `Validation failed: ${err.message}` });
    }
  };

  const resetDemoData = () => {
    localStorage.removeItem('kmp_pulse_v3_companies');
    localStorage.removeItem('kmp_pulse_v3_kmps');
    setCompanies(INITIAL_COMPANIES);
    setKmps(INITIAL_KMPS);
    setImportFeedback({ ok: true, message: 'Restored default verified starter dataset.' });
  };

  const origMetrics = useMemo(() => computeKmpMetrics(selectedKmp, selectedKmp?.startFy), [selectedKmp, companyMap, nowMs]);
  const simMetrics = useMemo(() => computeKmpMetrics(selectedKmp, simStartFy), [selectedKmp, simStartFy, companyMap, nowMs]);

  const attributionBreakdown = useMemo(() => {
    const rawRevGrowth = simMetrics.revCagr ?? 0;
    const rawAlpha = simMetrics.alpha ?? 0;
    const externalDiscount = Math.min(85, Math.round(marketBetaWeight * 0.6 + predecessorWeight * 0.5));
    const roleFocus =
      selectedKmp?.roleArchetype === 'CFO'
        ? 'Capital Efficiency, Margin & PAT Discipline'
        : 'Top-Line Growth, Strategic Execution & Benchmark Alpha';
    const baseComposite =
      selectedKmp?.roleArchetype === 'CFO'
        ? (simMetrics.patCagr ?? 0) * 0.6 + (simMetrics.revCagr ?? 0) * 0.4
        : rawRevGrowth * 0.5 + Math.max(-20, Math.min(40, rawAlpha * 0.25)) * 0.5;
    const adjustedScore = Math.max(0, Math.min(100, Math.round((50 + baseComposite * 1.4) * (1 - externalDiscount / 140))));
    return { externalDiscount, roleFocus, adjustedScore };
  }, [simMetrics, marketBetaWeight, predecessorWeight, selectedKmp]);

  const TAB_CLUSTERS = [
    {
      cluster: 'Identity & Career',
      tabs: [
        { id: 'overview', label: '1. Overview' },
        { id: 'career', label: '2. Career History' },
        { id: 'footprint', label: '3. Photos & Public Bio' },
        { id: 'associations', label: '4. Associations' }
      ]
    },
    {
      cluster: 'Money & Market Impact',
      tabs: [
        { id: 'shareholding', label: '5. Shareholding' },
        { id: 'remuneration', label: '6. Remuneration' },
        { id: 'impact', label: '7. Impact & What-If' }
      ]
    },
    {
      cluster: 'Filings, Voice & Dossier',
      tabs: [
        { id: 'appointments', label: '8. Appts & Exits' },
        { id: 'documents', label: '9. Agreements' },
        { id: 'statements', label: '10. Public Domain' },
        { id: 'news', label: '11. Announcements' },
        { id: 'dossier', label: '12. PDF Dossier' }
      ]
    }
  ];

  const themeVariables = useMemo(() => {
    if (skinMode === 'BEFORE_SLATE') {
      return {
        '--bg': '#020617',
        '--surface': '#0f172a',
        '--text': '#f8fafc',
        '--muted': '#94a3b8',
        '--border': '#1e293b',
        '--accent': '#38bdf8',
        '--accent-fill': '#0284c7',
        '--accent-soft': '#0369a1',
        '--accent-soft-text': '#e0f2fe'
      };
    } else if (skinMode === 'AFTER_DARK') {
      return {
        '--bg': '#0F1115',
        '--surface': '#1A1D24',
        '--text': '#F2F4F7',
        '--muted': '#9AA3B2',
        '--border': '#2A2F3A',
        '--accent': '#12B886',
        '--accent-fill': '#12B886',
        '--accent-soft': '#12362B',
        '--accent-soft-text': '#7CE3B8'
      };
    } else {
      return {
        '--bg': '#FFFFFF',
        '--surface': '#F3F5F7',
        '--text': '#1B1E25',
        '--muted': '#5B6270',
        '--border': '#E3E6EA',
        '--accent': '#087F5B',
        '--accent-fill': '#12B886',
        '--accent-soft': '#D3F9E8',
        '--accent-soft-text': '#08684B'
      };
    }
  }, [skinMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 font-sans antialiased selection:bg-emerald-500/30 ${
        skinMode === 'BEFORE_SLATE' ? 'bg-slate-950 text-slate-100' : ''
      }`}
      style={{
        backgroundColor: 'var(--bg, #FFFFFF)',
        color: 'var(--text, #1B1E25)',
        ...themeVariables
      }}
    >
      <style>{`
        @media print {
          body, .min-h-screen { background: #ffffff !important; color: #0f172a !important; }
          .no-print { display: none !important; }
          .print-dossier { background: #ffffff !important; color: #0f172a !important; border: none !important; box-shadow: none !important; }
          .print-card { background: #f8fafc !important; color: #0f172a !important; border: 1px solid #cbd5e1 !important; break-inside: avoid; }
        }
      `}</style>

      {/* TOAST FEEDBACK */}
      {toastMsg && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white border border-emerald-500/40 px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP SYSTEM, SUBSCRIPTION TIER & VISUAL SKIN SWITCHER */}
      <div
        className="no-print border-b px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 transition-colors"
        style={{
          backgroundColor: skinMode === 'BEFORE_SLATE' ? '#0f172a' : 'var(--surface, #F3F5F7)',
          borderColor: skinMode === 'BEFORE_SLATE' ? '#1e293b' : 'var(--border, #E3E6EA)'
        }}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold border text-[11px]"
            style={{
              backgroundColor: 'var(--accent-soft, #D3F9E8)',
              color: 'var(--accent-soft-text, #08684B)',
              borderColor: 'var(--border, #E3E6EA)'
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            BEYOND SCREENER.COM · NON-TECHNICAL MARKET-MOVING INTELLIGENCE
          </span>
          <span className="hidden md:inline font-medium" style={{ color: 'var(--muted, #5B6270)' }}>
            Coverage: <strong>{companies.length}</strong> Listed Entities · <strong>{kmps.length}</strong> KMP 360° Profiles
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Subscription Tier Preview Toggle */}
          <div className="inline-flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted, #5B6270)' }}>
              Plan View:
            </span>
            <button
              type="button"
              onClick={() => setSubscriptionTier((t) => (t === 'PRO' ? 'FREE' : 'PRO'))}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition ${
                subscriptionTier === 'PRO'
                  ? 'bg-amber-500/15 text-amber-700 border-amber-400/50'
                  : 'bg-slate-200/70 text-slate-700 border-slate-300'
              }`}
            >
              {subscriptionTier === 'PRO' ? <Unlock className="w-3 h-3 text-amber-600" /> : <Lock className="w-3 h-3" />}
              {subscriptionTier === 'PRO' ? 'CORPINTEL PRO (Active)' : 'Free Reader (Preview Paywall)'}
            </button>
            <button
              type="button"
              onClick={() => setShowPricingModal(true)}
              className="text-[11px] font-bold underline cursor-pointer"
              style={{ color: 'var(--accent, #087F5B)' }}
            >
              Plans
            </button>
          </div>

          {/* Skin Switcher */}
          <div
            className="inline-flex items-center rounded-lg p-0.5 border"
            style={{ backgroundColor: skinMode === 'BEFORE_SLATE' ? '#020617' : 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}
          >
            <button
              type="button"
              onClick={() => setSkinMode('AFTER_LIGHT')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                skinMode === 'AFTER_LIGHT' ? 'shadow-sm text-white' : ''
              }`}
              style={{
                backgroundColor: skinMode === 'AFTER_LIGHT' ? '#087F5B' : 'transparent',
                color: skinMode === 'AFTER_LIGHT' ? '#FFFFFF' : 'var(--muted, #5B6270)'
              }}
            >
              <Sun className="w-3 h-3" /> Light
            </button>
            <button
              type="button"
              onClick={() => setSkinMode('AFTER_DARK')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                skinMode === 'AFTER_DARK' ? 'shadow-sm text-slate-900' : ''
              }`}
              style={{
                backgroundColor: skinMode === 'AFTER_DARK' ? '#12B886' : 'transparent',
                color: skinMode === 'AFTER_DARK' ? '#0F1115' : 'var(--muted, #5B6270)'
              }}
            >
              <Moon className="w-3 h-3" /> Dark
            </button>
            <button
              type="button"
              onClick={() => setSkinMode('BEFORE_SLATE')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                skinMode === 'BEFORE_SLATE' ? 'bg-sky-500 text-slate-950 shadow-sm' : ''
              }`}
              style={{
                color: skinMode === 'BEFORE_SLATE' ? '#020617' : 'var(--muted, #5B6270)'
              }}
            >
              <Layout className="w-3 h-3" /> Slate
            </button>
          </div>
        </div>
      </div>

      {/* HEADER NAVIGATION */}
      <header
        className="no-print sticky top-0 z-30 border-b backdrop-blur px-4 lg:px-8 py-3 transition-colors"
        style={{
          backgroundColor:
            skinMode === 'BEFORE_SLATE'
              ? 'rgba(2, 6, 23, 0.95)'
              : skinMode === 'AFTER_DARK'
              ? 'rgba(15, 17, 21, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
          borderColor: 'var(--border, #E3E6EA)'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-base"
              style={{ backgroundColor: skinMode === 'BEFORE_SLATE' ? '#0284c7' : '#087F5B' }}
            >
              KP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight" style={{ color: 'var(--text, #1B1E25)' }}>
                  KMP PULSE
                </h1>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: 'var(--accent-soft, #D3F9E8)',
                    color: 'var(--accent-soft-text, #08684B)',
                    borderColor: 'var(--border, #E3E6EA)'
                  }}
                >
                  CORPINTEL PRO
                </span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--muted, #5B6270)' }}>
                People, Governance, Catalysts & Insider Flows That Move Share Prices
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'command', label: 'Command Centre', icon: Activity },
              { id: 'catalysts', label: 'Price Catalysts & Governance', icon: Zap },
              { id: 'directory', label: 'KMP Explorer', icon: Users },
              { id: 'profile', label: 'Executive 360°', icon: UserCheck },
              { id: 'radar', label: 'Exit Radar & Deals', icon: AlertTriangle },
              { id: 'company', label: 'Company Hub', icon: Building },
              { id: 'data', label: 'Data & Pilot', icon: Database }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive ? 'shadow-sm' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: isActive ? (skinMode === 'BEFORE_SLATE' ? '#0284c7' : '#087F5B') : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--text, #1B1E25)'
                  }}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowCompare((s) => !s)}
              className="ml-1 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition hover:shadow-sm"
              style={{
                backgroundColor: 'var(--surface, #F3F5F7)',
                borderColor: 'var(--border, #E3E6EA)',
                color: 'var(--text, #1B1E25)'
              }}
            >
              <Pin className="w-3.5 h-3.5 text-emerald-600" />
              Compare ({pinnedIds.length})
            </button>
          </nav>
        </div>
      </header>

      {/* COMPLIANCE NOTE STRIP */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-4 no-print">
        <NoteStrip skinMode={skinMode} />
      </div>

      {/* MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* ===================================================================== */}
        {/* VIEW 1: CORPINTEL COMMAND CENTRE                                      */}
        {/* ===================================================================== */}
        {activeNav === 'command' && (
          <div className="space-y-6">
            {/* HERO HIGHLIGHT CARD */}
            <div
              className="rounded-2xl p-6 shadow-md border transition-all"
              style={{
                backgroundColor: skinMode === 'BEFORE_SLATE' ? '#0f172a' : '#0B5A43',
                borderColor: skinMode === 'BEFORE_SLATE' ? '#1e293b' : '#0F6F53',
                color: '#FFFFFF'
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Landmark className="w-5 h-5 text-emerald-300" />
                    Beyond Financial Ratios: The Human & Governance Alpha Terminal
                  </h2>
                  <p className="text-sm text-emerald-100/90 mt-1 max-w-3xl">
                    Financial screeners tell you what happened last quarter. KMP Pulse tracks the people, Reg. 30 disclosures, governance red flags, and insider deals that re-rate share prices next.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-emerald-200 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search KMP, DIN, NSE ticker..."
                      className="w-full bg-[#0F6F53]/90 border border-emerald-400/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-emerald-200/70 focus:outline-none focus:border-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNav('directory')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-emerald-50 cursor-pointer shadow-sm"
                  >
                    Explore
                  </button>
                </div>
              </div>

              {/* 4 KPI Inner Stat Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="bg-[#0F6F53]/90 border border-emerald-400/30 rounded-xl p-3.5">
                  <div className="text-[11px] text-emerald-200 font-medium uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-300" /> Tracked KMPs
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{kmps.length}</div>
                  <div className="text-[11px] text-emerald-200 mt-0.5">
                    {kmps.filter((k) => k.status === 'In-Office').length} In-Office · {kmps.filter((k) => k.status === 'Former').length} Former
                  </div>
                </div>
                <div className="bg-[#0F6F53]/90 border border-emerald-400/30 rounded-xl p-3.5">
                  <div className="text-[11px] text-emerald-200 font-medium uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-300" /> Active Catalysts
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {companies.reduce((acc, c) => acc + (c.catalysts?.length || 0), 0)}
                  </div>
                  <div className="text-[11px] text-emerald-200 mt-0.5">Succession, Buybacks & RBI Windows</div>
                </div>
                <div className="bg-[#0F6F53]/90 border border-emerald-400/30 rounded-xl p-3.5">
                  <div className="text-[11px] text-emerald-200 font-medium uppercase tracking-wider flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-sky-300" /> Watchlist Alerts
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{alertSubscriptions.length}</div>
                  <div className="text-[11px] text-emerald-200 mt-0.5">Instant Reg. 30 & PIT Triggers</div>
                </div>
                <div className="bg-[#0F6F53]/90 border border-emerald-400/30 rounded-xl p-3.5">
                  <div className="text-[11px] text-emerald-200 font-medium uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Avg Governance Score
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-200 mt-1">
                    {Math.round(companies.reduce((a, c) => a + (c.governanceScore || 85), 0) / companies.length)} / 100
                  </div>
                  <div className="text-[11px] text-emerald-200 mt-0.5">Pledge, Churn & Audit Checked</div>
                </div>
              </div>
            </div>

            {/* SHARE-PRICE MOVING CATALYST & GOVERNANCE STRIP */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Latest Movements Feed */}
              <div
                className="lg:col-span-2 border rounded-2xl p-5 transition-colors"
                style={{
                  backgroundColor: 'var(--surface, #F3F5F7)',
                  borderColor: 'var(--border, #E3E6EA)'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text, #1B1E25)' }}>
                    <Activity className="w-4 h-4 text-emerald-600" /> Latest Reg. 30 KMP Movements & 5D/30D Market Reaction
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveNav('catalysts')}
                    className="text-xs font-semibold cursor-pointer hover:underline"
                    style={{ color: 'var(--accent, #087F5B)' }}
                  >
                    Open Catalyst & Governance Hub →
                  </button>
                </div>
                <div className="space-y-3">
                  {movements.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedKmpId(m.executiveId);
                        setActiveNav('profile');
                      }}
                      className="p-4 rounded-xl border hover:shadow-md cursor-pointer transition"
                      style={{
                        backgroundColor: 'var(--bg, #FFFFFF)',
                        borderColor: 'var(--border, #E3E6EA)'
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {m.type}
                          </span>
                          <span className="font-bold text-sm" style={{ color: 'var(--text, #1B1E25)' }}>
                            {m.executiveName}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--muted, #5B6270)' }}>
                            · {m.companyName} ({m.ticker})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StrengthBars strength={m.strength || 'Moderate'} skinMode={skinMode} />
                          <VerificationBadge
                            status={m.provenance}
                            meta={{ sourceName: m.sourceRef, publicationDate: m.announcedDate }}
                            onInspect={setInspectedProvenance}
                            skinMode={skinMode}
                          />
                        </div>
                      </div>
                      <p className="text-xs mt-2" style={{ color: 'var(--text, #1B1E25)' }}>
                        {m.reason}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] font-mono" style={{ color: 'var(--muted, #5B6270)' }}>
                        <span>Announced: {m.announcedDate}</span>
                        <span>Effective: {m.effectiveDate}</span>
                        <span>
                          5D Move: <strong className="text-emerald-600 font-bold">{m.stockReaction5d}</strong>
                        </span>
                        <span>
                          30D Drift: <strong className="text-sky-600 font-bold">{m.stockReaction30d}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Watchlist Alert Subscription Box (Recurring Subscriber Stickiness) */}
              <div
                className="border rounded-2xl p-5 transition-colors flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--surface, #F3F5F7)',
                  borderColor: 'var(--border, #E3E6EA)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text, #1B1E25)' }}>
                      <Bell className="w-4 h-4 text-emerald-600" /> Real-Time Filing Watchlist
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      PRO FEATURE
                    </span>
                  </div>
                  <p className="text-[11px] mt-1 mb-4" style={{ color: 'var(--muted, #5B6270)' }}>
                    Receive instant alerts when a tracked company files a KMP resignation, ESOP grant, promoter pledge, or bulk deal.
                  </p>
                  <div className="space-y-2.5">
                    {companies.map((c) => {
                      const isSubscribed = alertSubscriptions.includes(c.id);
                      return (
                        <div
                          key={c.id}
                          className="p-3 rounded-xl border flex items-center justify-between gap-2"
                          style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}
                        >
                          <div>
                            <div className="text-xs font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                              {c.displayName} <span className="font-mono text-[10px] text-emerald-600">({c.nseSymbol})</span>
                            </div>
                            <div className="text-[11px]" style={{ color: 'var(--muted, #5B6270)' }}>
                              Gov Score: <strong>{c.governanceScore}/100</strong> · Pledge: {c.promoterPledgePct}%
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleWatchlistAlert(c.id, c.displayName)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                              isSubscribed
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-900 text-white hover:opacity-90'
                            }`}
                          >
                            {isSubscribed ? '✓ Subscribed' : '+ Alert Me'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t text-[11px]" style={{ borderColor: 'var(--border, #E3E6EA)', color: 'var(--muted, #5B6270)' }}>
                  Why subscribers renew: Catches sudden CFO exits & promoter pledges within 15 minutes of BSE/NSE exchange upload.
                </div>
              </div>
            </div>

            {/* Featured Executive Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text, #1B1E25)' }}>
                  Featured Executive 360° Profiles
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveNav('directory')}
                  className="text-xs font-semibold cursor-pointer hover:underline"
                  style={{ color: 'var(--accent, #087F5B)' }}
                >
                  View All KMPs →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kmps.map((kmp) => {
                  const comp = companyMap[kmp.companyId];
                  const m = computeKmpMetrics(kmp);
                  return (
                    <div
                      key={kmp.id}
                      onClick={() => {
                        setSelectedKmpId(kmp.id);
                        setActiveNav('profile');
                      }}
                      className="border rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between hover:shadow-md"
                      style={{
                        backgroundColor: 'var(--bg, #FFFFFF)',
                        borderColor: 'var(--border, #E3E6EA)'
                      }}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm">
                            {kmp.commonName
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <VerificationBadge status={kmp.verification.status} meta={kmp.verification} onInspect={setInspectedProvenance} skinMode={skinMode} />
                        </div>
                        <div className="mt-3">
                          <div className="font-bold text-sm" style={{ color: 'var(--text, #1B1E25)' }}>
                            {kmp.commonName}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--muted, #5B6270)' }}>
                            {kmp.designation}
                          </div>
                          <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--accent, #087F5B)' }}>
                            {comp?.displayName} ({comp?.nseSymbol})
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t space-y-1.5 text-xs font-mono" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
                        <div className="flex justify-between items-center">
                          <span style={{ color: 'var(--muted, #5B6270)' }}>Signal Strength:</span>
                          <StrengthBars strength={kmp.strength || 'High'} skinMode={skinMode} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--muted, #5B6270)' }}>Live Tenure:</span>
                          <span className="font-semibold" style={{ color: 'var(--text, #1B1E25)' }}>
                            {m.tenure.years}y {m.tenure.days}d {String(m.tenure.hours).padStart(2, '0')}:
                            {String(m.tenure.minutes).padStart(2, '0')}:{String(m.tenure.seconds).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--muted, #5B6270)' }}>Rev CAGR:</span>
                          <span className="text-emerald-600 font-bold">{m.revCagr !== null ? `${m.revCagr.toFixed(1)}%` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--muted, #5B6270)' }}>vs Nifty 50:</span>
                          <span className={m.alpha !== null && m.alpha >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            {m.alpha !== null ? `${m.alpha >= 0 ? '+' : ''}${m.alpha.toFixed(1)}%` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 2: SHARE-PRICE CATALYSTS & GOVERNANCE FORENSICS (NEW PRO MODULE) */}
        {/* ===================================================================== */}
        {activeNav === 'catalysts' && (
          <div className="space-y-6">
            <div
              className="border rounded-2xl p-6 transition-colors"
              style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text, #1B1E25)' }}>
                    <Zap className="w-5 h-5 text-emerald-600" /> Non-Technical Share-Price Catalysts & Governance Forensics
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted, #5B6270)' }}>
                    Everything outside P/E & candlestick charts that re-rates multiples: Succession triggers, capital return windows, promoter pledges, RPT exposure & institutional block flows.
                  </p>
                </div>
                <div className="flex gap-2">
                  {companies.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCompanyId(c.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                        c.id === selectedCompanyId ? 'text-white shadow-sm' : 'border'
                      }`}
                      style={{
                        backgroundColor: c.id === selectedCompanyId ? '#087F5B' : 'var(--bg, #FFFFFF)',
                        borderColor: 'var(--border, #E3E6EA)',
                        color: c.id === selectedCompanyId ? '#FFFFFF' : 'var(--text, #1B1E25)'
                      }}
                    >
                      {c.displayName}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const comp = companyMap[selectedCompanyId] || companies[0];
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Upcoming Catalyst Calendar */}
                    <div
                      className="border rounded-2xl p-5 space-y-4"
                      style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text, #1B1E25)' }}>
                          <TrendingUp className="w-4 h-4 text-emerald-600" /> Event & Re-Rating Catalyst Windows ({comp.nseSymbol})
                        </h3>
                        <span className="text-xs font-mono font-bold text-emerald-600">
                          Governance Score: {comp.governanceScore}/100
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(comp.catalysts || []).map((cat) => {
                          const locked = cat.isPro && subscriptionTier === 'FREE';
                          return (
                            <div
                              key={cat.id}
                              className="p-4 rounded-xl border relative overflow-hidden"
                              style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                  {cat.window}
                                </span>
                                <div className="flex items-center gap-2">
                                  <StrengthBars strength={cat.impactPotential} skinMode={skinMode} />
                                  <VerificationBadge status={cat.provenance} onInspect={setInspectedProvenance} skinMode={skinMode} />
                                </div>
                              </div>
                              <div className="font-bold text-sm mt-2" style={{ color: 'var(--text, #1B1E25)' }}>
                                {cat.event}
                              </div>

                              {locked ? (
                                <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between gap-2">
                                  <span className="text-xs text-amber-900 font-medium flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-amber-600" /> Historical Price-Reaction Analog locked on Free tier
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setSubscriptionTier('PRO')}
                                    className="px-2.5 py-1 rounded-md bg-amber-600 text-white text-[11px] font-bold cursor-pointer"
                                  >
                                    Unlock Pro
                                  </button>
                                </div>
                              ) : (
                                <div className="mt-2 text-xs font-mono text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg">
                                  Historical Analog: <strong>{cat.historicalAnalog}</strong>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Governance & Forensic Hygiene Checklist */}
                    <div
                      className="border rounded-2xl p-5 space-y-4"
                      style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}
                    >
                      <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text, #1B1E25)' }}>
                        <ShieldAlert className="w-4 h-4 text-amber-500" /> Governance & Forensic Hygiene Audit ({comp.nseSymbol})
                      </h3>
                      <div className="space-y-2.5">
                        {(comp.governanceRedFlags || []).map((rf, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border flex flex-col gap-1"
                            style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                                {rf.check}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                  rf.risk === 'Low'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                {rf.status}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: 'var(--muted, #5B6270)' }}>
                              {rf.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Insider PIT & Institutional Block Flow Tape */}
            <div
              className="border rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text, #1B1E25)' }}>
                    <BarChart3 className="w-4 h-4 text-emerald-600" /> SEBI PIT Insider Trades, ESOP Vesting & Institutional Block Deals
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted, #5B6270)' }}>
                    Separates routine ESOP exercises from genuine promoter/KMP open-market conviction buying or PE supply clean-outs.
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b font-semibold" style={{ color: 'var(--muted, #5B6270)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <tr>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Company</th>
                      <th className="py-2 pr-4">Acquirer / Disposer</th>
                      <th className="py-2 pr-4">Transaction Mode</th>
                      <th className="py-2 pr-4">Value (₹ Cr)</th>
                      <th className="py-2 pr-4">Market Signal Interpretation</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
                    {INSIDER_DEAL_FEED.map((deal) => (
                      <tr key={deal.id}>
                        <td className="py-3 pr-4 font-mono" style={{ color: 'var(--muted, #5B6270)' }}>
                          {deal.date}
                        </td>
                        <td className="py-3 pr-4 font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                          {deal.company} ({deal.ticker})
                        </td>
                        <td className="py-3 pr-4 font-medium" style={{ color: 'var(--text, #1B1E25)' }}>
                          {deal.person}
                        </td>
                        <td className="py-3 pr-4 font-mono text-[11px]" style={{ color: 'var(--muted, #5B6270)' }}>
                          {deal.mode}
                        </td>
                        <td className="py-3 pr-4 font-mono font-bold text-emerald-600">₹{deal.valueCr.toFixed(1)} Cr</td>
                        <td className="py-3 pr-4 font-medium" style={{ color: 'var(--text, #1B1E25)' }}>
                          {deal.signalInterpretation}
                        </td>
                        <td className="py-3">
                          <VerificationBadge status={deal.provenance} onInspect={setInspectedProvenance} skinMode={skinMode} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 3: KMP DIRECTORY & EXPLORER                                      */}
        {/* ===================================================================== */}
        {activeNav === 'directory' && (
          <div className="space-y-5">
            <div
              className="border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3 transition-colors"
              style={{
                backgroundColor: 'var(--surface, #F3F5F7)',
                borderColor: 'var(--border, #E3E6EA)'
              }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by name, DIN, role, company..."
                    className="border rounded-xl pl-9 pr-3 py-2 text-xs w-64 focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg, #FFFFFF)',
                      borderColor: 'var(--border, #E3E6EA)',
                      color: 'var(--text, #1B1E25)'
                    }}
                  />
                </div>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="border rounded-xl px-3 py-2 text-xs cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg, #FFFFFF)',
                    borderColor: 'var(--border, #E3E6EA)',
                    color: 'var(--text, #1B1E25)'
                  }}
                >
                  <option value="ALL">All Companies</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.displayName} ({c.nseSymbol})
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-xl px-3 py-2 text-xs cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg, #FFFFFF)',
                    borderColor: 'var(--border, #E3E6EA)',
                    color: 'var(--text, #1B1E25)'
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="In-Office">In-Office</option>
                  <option value="Former">Former</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--muted, #5B6270)' }}>
                  <Filter className="w-3.5 h-3.5" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-xl px-3 py-2 text-xs cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg, #FFFFFF)',
                    borderColor: 'var(--border, #E3E6EA)',
                    color: 'var(--text, #1B1E25)'
                  }}
                >
                  <option value="TENURE_DESC">Longest Tenure</option>
                  <option value="REV_CAGR_DESC">Highest Revenue CAGR</option>
                  <option value="ALPHA_DESC">Highest Stock vs Nifty Alpha</option>
                  <option value="NEWEST">Newest Appointment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKmps.map((kmp) => {
                const comp = companyMap[kmp.companyId];
                const m = computeKmpMetrics(kmp);
                const isPinned = pinnedIds.includes(kmp.id);
                return (
                  <div
                    key={kmp.id}
                    className="border rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition"
                    style={{
                      backgroundColor: 'var(--bg, #FFFFFF)',
                      borderColor: 'var(--border, #E3E6EA)'
                    }}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-base shrink-0">
                            {kmp.commonName
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base" style={{ color: 'var(--text, #1B1E25)' }}>
                                {kmp.fullLegalName}
                              </h3>
                              <span
                                className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${
                                  kmp.status === 'In-Office'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                              >
                                {kmp.status}
                              </span>
                            </div>
                            <div className="text-xs" style={{ color: 'var(--muted, #5B6270)' }}>
                              {kmp.designation}
                            </div>
                            <div className="text-xs font-mono font-medium mt-0.5" style={{ color: 'var(--accent, #087F5B)' }}>
                              {comp?.displayName} ({comp?.nseSymbol}) · DIN: {kmp.din}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <VerificationBadge status={kmp.verification.status} meta={kmp.verification} onInspect={setInspectedProvenance} skinMode={skinMode} />
                          <StrengthBars strength={kmp.strength || 'High'} skinMode={skinMode} />
                        </div>
                      </div>

                      <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text, #1B1E25)' }}>
                        {kmp.brief30s.mandate}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div>
                          <div className="text-[10px]" style={{ color: 'var(--muted, #5B6270)' }}>
                            TENURE CLOCK
                          </div>
                          <div className="font-semibold" style={{ color: 'var(--text, #1B1E25)' }}>
                            {m.tenure.years}y {m.tenure.days}d {String(m.tenure.hours).padStart(2, '0')}:
                            {String(m.tenure.minutes).padStart(2, '0')}:{String(m.tenure.seconds).padStart(2, '0')}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px]" style={{ color: 'var(--muted, #5B6270)' }}>
                            REV CAGR
                          </div>
                          <div className="text-emerald-600 font-bold">{m.revCagr !== null ? `${m.revCagr.toFixed(1)}%` : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[10px]" style={{ color: 'var(--muted, #5B6270)' }}>
                            VS NIFTY 50
                          </div>
                          <div className={m.alpha !== null && m.alpha >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            {m.alpha !== null ? `${m.alpha >= 0 ? '+' : ''}${m.alpha.toFixed(1)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => togglePin(kmp.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition ${
                            isPinned ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {isPinned ? 'Pinned' : 'Pin'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedKmpId(kmp.id);
                            setActiveNav('profile');
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white cursor-pointer shadow-sm"
                          style={{ backgroundColor: '#087F5B' }}
                        >
                          Open 360° →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 4: EXECUTIVE 360° PROFILE                                        */}
        {/* ===================================================================== */}
        {activeNav === 'profile' && selectedKmp && (
          <div className="space-y-6 print-dossier">
            <div
              className="no-print flex flex-wrap items-center justify-between gap-3 border rounded-2xl px-4 py-2.5 transition-colors"
              style={{
                backgroundColor: 'var(--surface, #F3F5F7)',
                borderColor: 'var(--border, #E3E6EA)'
              }}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                  Switch Executive:
                </span>
                {kmps.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setSelectedKmpId(k.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                      k.id === selectedKmp.id ? 'text-white shadow-sm' : 'border hover:opacity-90'
                    }`}
                    style={{
                      backgroundColor: k.id === selectedKmp.id ? '#087F5B' : 'var(--bg, #FFFFFF)',
                      borderColor: 'var(--border, #E3E6EA)',
                      color: k.id === selectedKmp.id ? '#FFFFFF' : 'var(--text, #1B1E25)'
                    }}
                  >
                    {k.commonName}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAiOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white cursor-pointer shadow-sm"
                  style={{ backgroundColor: '#087F5B' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask Grounded AI Assistant
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (subscriptionTier === 'FREE') {
                      setShowPricingModal(true);
                      return;
                    }
                    setProfileTab('dossier');
                    setTimeout(() => window.print(), 150);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer hover:shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg, #FFFFFF)',
                    borderColor: 'var(--border, #E3E6EA)',
                    color: 'var(--text, #1B1E25)'
                  }}
                >
                  <Printer className="w-3.5 h-3.5" />
                  {subscriptionTier === 'PRO' ? 'Export PDF Dossier' : 'PDF Dossier (Pro)'}
                </button>
              </div>
            </div>

            {/* EXECUTIVE HERO CARD */}
            <div
              className="rounded-2xl p-6 shadow-md border text-white transition-all print-card"
              style={{
                backgroundColor: skinMode === 'BEFORE_SLATE' ? '#0f172a' : '#0B5A43',
                borderColor: skinMode === 'BEFORE_SLATE' ? '#1e293b' : '#0F6F53'
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0F6F53] border border-emerald-400/30 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-white">
                      {selectedKmp.commonName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <span className="text-[9px] text-emerald-200 uppercase font-semibold">Verified</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">{selectedKmp.fullLegalName}</h2>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#0F6F53] text-emerald-100 border border-emerald-400/30">
                        DIN: {selectedKmp.din}
                      </span>
                      <VerificationBadge
                        status={selectedKmp.verification.status}
                        meta={selectedKmp.verification}
                        onInspect={setInspectedProvenance}
                        skinMode={skinMode}
                      />
                    </div>
                    <p className="text-sm text-emerald-200 font-semibold mt-1">
                      {selectedKmp.designation} · {selectedCompany?.legalName} ({selectedCompany?.nseSymbol})
                    </p>
                    <p className="text-xs text-emerald-100/90 mt-1">{selectedKmp.headline}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-emerald-200">
                      <span>Location: {selectedKmp.location}</span>
                      <span>Experience: ~{selectedKmp.experienceYears} yrs</span>
                      <span>
                        Role Archetype: <strong className="text-white font-bold">{selectedKmp.roleArchetype}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        Signal Strength: <StrengthBars strength={selectedKmp.strength || 'High'} skinMode={skinMode} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F6F53]/90 border border-emerald-400/30 rounded-xl p-4 min-w-[260px] font-mono">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-200 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-300" />
                    {selectedKmp.status === 'In-Office' ? 'Live Active Tenure Counter' : 'Completed Tenure Duration'}
                  </div>
                  <div className="text-xl font-bold text-white mt-1">
                    {origMetrics.tenure.years}y {origMetrics.tenure.days}d{' '}
                    <span className="text-emerald-300">
                      {String(origMetrics.tenure.hours).padStart(2, '0')}:
                      {String(origMetrics.tenure.minutes).padStart(2, '0')}:
                      {String(origMetrics.tenure.seconds).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-200/80 mt-1">
                    Appointed: {selectedKmp.appointmentDate.slice(0, 10)}
                    {selectedKmp.exitDate ? ` · Exited: ${selectedKmp.exitDate.slice(0, 10)}` : ' · Active'}
                  </div>
                </div>
              </div>

              {/* 30-Second Executive Brief */}
              <div className="mt-5 pt-5 border-t border-emerald-400/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0F6F53]/90 border border-emerald-400/30 rounded-xl p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">30s Brief · Mandate & Arc</div>
                  <p className="text-xs text-white mt-1 leading-relaxed">{selectedKmp.brief30s.mandate}</p>
                </div>
                <div className="bg-[#0F6F53]/90 border border-emerald-400/30 rounded-xl p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">30s Brief · Observed Financials</div>
                  <p className="text-xs text-white mt-1 leading-relaxed">{selectedKmp.brief30s.financialHighlight}</p>
                </div>
                <div className="bg-[#0F6F53]/90 border border-emerald-400/30 rounded-xl p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">30s Brief · Governance & Terms</div>
                  <p className="text-xs text-white mt-1 leading-relaxed">{selectedKmp.brief30s.governanceNote}</p>
                </div>
              </div>
            </div>

            {/* 12-Tab Navigation Clusters */}
            <div
              className="no-print border rounded-2xl p-3 space-y-2 transition-colors"
              style={{
                backgroundColor: 'var(--surface, #F3F5F7)',
                borderColor: 'var(--border, #E3E6EA)'
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {TAB_CLUSTERS.map((group) => (
                  <div key={group.cluster} className="border rounded-xl p-2" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider px-2 mb-1.5" style={{ color: 'var(--muted, #5B6270)' }}>
                      {group.cluster}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {group.tabs.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setProfileTab(t.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            profileTab === t.id ? 'text-white shadow-sm' : 'hover:opacity-80'
                          }`}
                          style={{
                            backgroundColor: profileTab === t.id ? '#087F5B' : 'transparent',
                            color: profileTab === t.id ? '#FFFFFF' : 'var(--text, #1B1E25)'
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {profileTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-2xl p-5 print-card" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text, #1B1E25)' }}>
                    Qualifications & Background
                  </h3>
                  <ul className="space-y-2 text-xs" style={{ color: 'var(--text, #1B1E25)' }}>
                    {selectedKmp.qualifications.map((q, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {q}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: 'var(--border, #E3E6EA)', color: 'var(--muted, #5B6270)' }}>
                    <strong>Photo & Identity Governance:</strong> {selectedKmp.photoMeta.sourceLabel} — {selectedKmp.photoMeta.licenseNote}
                  </div>
                </div>

                <div className="border rounded-2xl p-5 print-card" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text, #1B1E25)' }}>
                    Tenure Performance Snapshot ({selectedCompany?.basis})
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <div style={{ color: 'var(--muted, #5B6270)' }}>
                        Revenue CAGR (FY{selectedKmp.startFy}–{selectedKmp.endFy})
                      </div>
                      <div className="text-lg font-bold text-emerald-600 mt-1">
                        {origMetrics.revCagr !== null ? `${origMetrics.revCagr.toFixed(1)}%` : 'N/A'}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <div style={{ color: 'var(--muted, #5B6270)' }}>
                        PAT CAGR (FY{selectedKmp.startFy}–{selectedKmp.endFy})
                      </div>
                      <div className="text-lg font-bold text-emerald-600 mt-1">
                        {origMetrics.patCagr !== null ? `${origMetrics.patCagr.toFixed(1)}%` : 'N/A'}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <div style={{ color: 'var(--muted, #5B6270)' }}>Stock Price Return</div>
                      <div className="text-lg font-bold text-sky-600 mt-1">
                        {origMetrics.stockReturn !== null ? `${origMetrics.stockReturn.toFixed(1)}%` : 'N/A'}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <div style={{ color: 'var(--muted, #5B6270)' }}>Nifty 50 Benchmark Return</div>
                      <div className="text-lg font-bold text-amber-600 mt-1">
                        {origMetrics.niftyReturn !== null ? `${origMetrics.niftyReturn.toFixed(1)}%` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CAREER */}
            {profileTab === 'career' && (
              <div className="border rounded-2xl p-6 print-card" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text, #1B1E25)' }}>
                  Chronological Career History Across Employers
                </h3>
                <div className="space-y-4">
                  {selectedKmp.careerHistory.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm" style={{ color: 'var(--text, #1B1E25)' }}>
                            {item.designation}
                          </div>
                          <div className="text-xs font-semibold" style={{ color: 'var(--accent, #087F5B)' }}>
                            {item.company}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-medium" style={{ color: 'var(--muted, #5B6270)' }}>
                            {item.from} → {item.to}
                          </span>
                          <VerificationBadge status={item.provenance.status} meta={item.provenance} onInspect={setInspectedProvenance} skinMode={skinMode} />
                        </div>
                      </div>
                      <p className="text-xs mt-2" style={{ color: 'var(--text, #1B1E25)' }}>
                        {item.summary}
                      </p>
                      {item.departureReason && (
                        <div className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-1.5 font-medium">
                          <strong>Disclosed Departure Reason:</strong> {item.departureReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: FOOTPRINT */}
            {profileTab === 'footprint' && (
              <div className="border rounded-2xl p-6 print-card space-y-4" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text, #1B1E25)' }}>
                  Photographs & Privacy-Compliant Digital Footprint
                </h3>
                <div className="p-4 rounded-xl border text-xs space-y-2" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--text, #1B1E25)' }}>
                  <div>
                    <strong>Portrait Attribution Policy:</strong> {selectedKmp.photoMeta.sourceLabel}
                  </div>
                  <div>
                    <strong>Copyright Notice:</strong> {selectedKmp.photoMeta.licenseNote}
                  </div>
                  <div>
                    <strong>Privacy Guardrail:</strong> Personal contact numbers, residential addresses, and family details are strictly excluded.
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <div className="font-semibold mb-1" style={{ color: 'var(--text, #1B1E25)' }}>
                      Primary Regulatory Filing Reference
                    </div>
                    <SafeExternalLink url={selectedKmp.verification.sourceUrl} label="Open Exchange Filing" />
                  </div>
                  <div className="p-3.5 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <div className="font-semibold mb-1" style={{ color: 'var(--text, #1B1E25)' }}>
                      Official Investor Relations Portal
                    </div>
                    <SafeExternalLink url={selectedCompany?.provenance?.sourceUrl} label={`Open ${selectedCompany?.displayName} IR Portal`} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ASSOCIATIONS */}
            {profileTab === 'associations' && (
              <div className="border rounded-2xl p-6 print-card" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text, #1B1E25)' }}>
                  Directorships, Subsidiaries & Corporate Associations (DIN: {selectedKmp.din})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b font-semibold" style={{ color: 'var(--muted, #5B6270)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <tr>
                        <th className="py-2 pr-4">Entity Name</th>
                        <th className="py-2 pr-4">Association Type</th>
                        <th className="py-2 pr-4">Role / Capacity</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
                      {selectedKmp.associations.map((a, i) => (
                        <tr key={i}>
                          <td className="py-2.5 pr-4 font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                            {a.entity}
                          </td>
                          <td className="py-2.5 pr-4 font-mono" style={{ color: 'var(--muted, #5B6270)' }}>
                            {a.type}
                          </td>
                          <td className="py-2.5 pr-4" style={{ color: 'var(--text, #1B1E25)' }}>
                            {a.role}
                          </td>
                          <td className="py-2.5 pr-4" style={{ color: 'var(--text, #1B1E25)' }}>
                            {a.status}
                          </td>
                          <td className="py-2.5">
                            <VerificationBadge status={a.provenance} onInspect={setInspectedProvenance} skinMode={skinMode} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: SHAREHOLDING */}
            {profileTab === 'shareholding' && (
              <div className="border rounded-2xl p-6 print-card space-y-4" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text, #1B1E25)' }}>
                    Disclosed Shareholdings & Financial Interests
                  </h3>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Total personal net worth is never inferred from incomplete public holdings.
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b font-semibold" style={{ color: 'var(--muted, #5B6270)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <tr>
                        <th className="py-2 pr-4">Company</th>
                        <th className="py-2 pr-4">Holding Category</th>
                        <th className="py-2 pr-4">Disclosed Shares</th>
                        <th className="py-2 pr-4">Ownership %</th>
                        <th className="py-2 pr-4">As Of</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-mono" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
                      {selectedKmp.shareholdings.map((s, i) => (
                        <tr key={i}>
                          <td className="py-2.5 pr-4 font-sans font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                            {s.company}
                          </td>
                          <td className="py-2.5 pr-4" style={{ color: 'var(--muted, #5B6270)' }}>
                            {s.category}
                          </td>
                          <td className="py-2.5 pr-4 font-semibold" style={{ color: 'var(--text, #1B1E25)' }}>
                            {s.shares ? s.shares.toLocaleString() : 'Not Disclosed'}
                          </td>
                          <td className="py-2.5 pr-4 font-bold text-emerald-600">{s.pct !== null ? `${s.pct}%` : 'N/A'}</td>
                          <td className="py-2.5 pr-4" style={{ color: 'var(--muted, #5B6270)' }}>
                            {s.asOf}
                          </td>
                          <td className="py-2.5 font-sans">
                            <VerificationBadge status={s.provenance} meta={{ sourceName: s.note, publicationDate: s.asOf }} onInspect={setInspectedProvenance} skinMode={skinMode} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: REMUNERATION */}
            {profileTab === 'remuneration' && (
              <div className="border rounded-2xl p-6 print-card" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text, #1B1E25)' }}>
                  Historical Disclosed Remuneration (INR Crores)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="border-b font-sans font-semibold" style={{ color: 'var(--muted, #5B6270)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <tr>
                        <th className="py-2 pr-4">Fiscal Year</th>
                        <th className="py-2 pr-4">Fixed Pay (₹ Cr)</th>
                        <th className="py-2 pr-4">Variable / Bonus (₹ Cr)</th>
                        <th className="py-2 pr-4">Perquisites & ESOPs (₹ Cr)</th>
                        <th className="py-2 pr-4">Total Disclosed (₹ Cr)</th>
                        <th className="py-2 font-sans">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
                      {selectedKmp.remuneration.map((r) => (
                        <tr key={r.fy}>
                          <td className="py-2.5 pr-4 font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                            {r.fy}
                          </td>
                          <td className="py-2.5 pr-4">{r.fixedCr.toFixed(2)}</td>
                          <td className="py-2.5 pr-4">{r.variableCr.toFixed(2)}</td>
                          <td className="py-2.5 pr-4">{r.perqEsopCr.toFixed(2)}</td>
                          <td className="py-2.5 pr-4 font-bold text-emerald-600">{r.totalCr.toFixed(2)}</td>
                          <td className="py-2.5 font-sans">
                            <VerificationBadge status={r.provenance} onInspect={setInspectedProvenance} skinMode={skinMode} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 7: IMPACT & WHAT-IF */}
            {profileTab === 'impact' && selectedCompany && (
              <div className="space-y-6">
                <div className="border rounded-2xl p-6 space-y-5" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text, #1B1E25)' }}>
                        Interactive "What-If Start Year" & Role-Aware Impact Simulator
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted, #5B6270)' }}>
                        Test how sensitive growth and benchmark alpha are to the baseline fiscal year. Correlation does not prove causation.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--text, #1B1E25)' }}>
                      Basis: {selectedCompany.basis} · INR Cr
                    </span>
                  </div>

                  <div className="border rounded-xl p-4" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <label className="text-xs font-semibold" style={{ color: 'var(--text, #1B1E25)' }}>
                        Simulated Baseline Start Year: <span className="font-mono text-emerald-600 font-bold">FY{simStartFy}</span>{' '}
                        <span style={{ color: 'var(--muted, #5B6270)' }}>(Actual Start: FY{selectedKmp.startFy})</span>
                      </label>
                      {simStartFy !== selectedKmp.startFy && (
                        <button
                          type="button"
                          onClick={() => setSimStartFy(selectedKmp.startFy)}
                          className="text-xs font-semibold cursor-pointer hover:underline"
                          style={{ color: 'var(--accent, #087F5B)' }}
                        >
                          Reset to Actual Start (FY{selectedKmp.startFy})
                        </button>
                      )}
                    </div>
                    <input
                      type="range"
                      min={selectedCompany.financials[0].fy}
                      max={selectedCompany.financials[selectedCompany.financials.length - 2].fy}
                      step={1}
                      value={simStartFy || selectedKmp.startFy}
                      onChange={(e) => setSimStartFy(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: 'var(--muted, #5B6270)' }}>
                      {selectedCompany.financials.slice(0, -1).map((f) => (
                        <span key={f.fy}>FY{String(f.fy).slice(-2)}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <div className="font-sans font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                        Revenue CAGR
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <div>
                          <div className="text-[10px]" style={{ color: 'var(--muted, #5B6270)' }}>
                            ACTUAL (FY{selectedKmp.startFy})
                          </div>
                          <div className="text-base font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                            {origMetrics.revCagr !== null ? `${origMetrics.revCagr.toFixed(1)}%` : 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-emerald-600 font-bold">SIMULATED (FY{simStartFy})</div>
                          <div className="text-lg font-bold text-emerald-600">
                            {simMetrics.revCagr !== null ? `${simMetrics.revCagr.toFixed(1)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <div className="font-sans font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                        PAT CAGR
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <div>
                          <div className="text-[10px]" style={{ color: 'var(--muted, #5B6270)' }}>
                            ACTUAL (FY{selectedKmp.startFy})
                          </div>
                          <div className="text-base font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                            {origMetrics.patCagr !== null ? `${origMetrics.patCagr.toFixed(1)}%` : 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-emerald-600 font-bold">SIMULATED (FY{simStartFy})</div>
                          <div className="text-lg font-bold text-emerald-600">
                            {simMetrics.patCagr !== null ? `${simMetrics.patCagr.toFixed(1)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <div className="font-sans font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                        Stock Return vs Nifty 50
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <div>
                          <div className="text-[10px]" style={{ color: 'var(--muted, #5B6270)' }}>
                            ACTUAL ALPHA
                          </div>
                          <div className="text-base font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                            {origMetrics.alpha !== null ? `${origMetrics.alpha >= 0 ? '+' : ''}${origMetrics.alpha.toFixed(1)}%` : 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-sky-600 font-bold">SIMULATED ALPHA</div>
                          <div className="text-lg font-bold text-sky-600">
                            {simMetrics.alpha !== null ? `${simMetrics.alpha >= 0 ? '+' : ''}${simMetrics.alpha.toFixed(1)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <WhatIfImpactChart
                    financials={selectedCompany.financials}
                    originalStartFy={selectedKmp.startFy}
                    simStartFy={simStartFy || selectedKmp.startFy}
                    endFy={selectedKmp.endFy}
                    skinMode={skinMode}
                  />

                  <div className="border rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text, #1B1E25)' }}>
                          Role-Aware Attribution Sensitivity Model ({selectedKmp.roleArchetype} Lens)
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--muted, #5B6270)' }}>
                          Primary Focus: <strong style={{ color: 'var(--text, #1B1E25)' }}>{attributionBreakdown.roleFocus}</strong> · Analytical indicator only.
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-[10px]" style={{ color: 'var(--muted, #5B6270)' }}>
                          ADJUSTED TENURE INDEX
                        </div>
                        <div className="text-xl font-bold text-emerald-600">{attributionBreakdown.adjustedScore} / 100</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="flex justify-between mb-1" style={{ color: 'var(--text, #1B1E25)' }}>
                          <span>Macro & Sector Tailwind Discount:</span>
                          <span className="font-mono font-bold text-emerald-600">{marketBetaWeight}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={80}
                          value={marketBetaWeight}
                          onChange={(e) => setMarketBetaWeight(Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1" style={{ color: 'var(--text, #1B1E25)' }}>
                          <span>Predecessor Pipeline Carryover Discount:</span>
                          <span className="font-mono font-bold text-emerald-600">{predecessorWeight}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={80}
                          value={predecessorWeight}
                          onChange={(e) => setPredecessorWeight(Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: APPOINTMENTS */}
            {profileTab === 'appointments' && (
              <div className="border rounded-2xl p-6 print-card space-y-3" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text, #1B1E25)' }}>
                  Regulatory Appointments & Resignations
                </h3>
                {movements
                  .filter((m) => m.executiveId === selectedKmp.id)
                  .map((m) => (
                    <div key={m.id} className="p-4 rounded-xl border text-xs" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <div className="flex justify-between items-center">
                        <strong style={{ color: 'var(--text, #1B1E25)' }}>
                          {m.type}: {m.newRole}
                        </strong>
                        <VerificationBadge status={m.provenance} onInspect={setInspectedProvenance} skinMode={skinMode} />
                      </div>
                      <p className="mt-1" style={{ color: 'var(--text, #1B1E25)' }}>
                        {m.reason}
                      </p>
                      <div className="font-mono mt-2" style={{ color: 'var(--muted, #5B6270)' }}>
                        Announced: {m.announcedDate} · Effective: {m.effectiveDate} · Ref: {m.sourceRef}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* TAB 9: DOCUMENTS / AGREEMENTS */}
            {profileTab === 'documents' && (
              <div className="border rounded-2xl p-6 print-card space-y-4" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text, #1B1E25)' }}>
                  Joining & Exit Contractual Disclosures (Public Filings Only)
                </h3>
                {selectedKmp.agreements.map((ag, i) => (
                  <div key={i} className="p-4 rounded-xl border space-y-2 text-xs" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm" style={{ color: 'var(--text, #1B1E25)' }}>
                        {ag.type} ({ag.date})
                      </span>
                      <VerificationBadge status={ag.provenance} meta={{ sourceName: ag.sourceRef, publicationDate: ag.date }} onInspect={setInspectedProvenance} skinMode={skinMode} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                        <div className="font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                          Notice Period
                        </div>
                        <div className="mt-1" style={{ color: 'var(--text, #1B1E25)' }}>
                          {ag.noticePeriod}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                        <div className="font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                          Non-Compete & Covenants
                        </div>
                        <div className="mt-1" style={{ color: 'var(--text, #1B1E25)' }}>
                          {ag.nonCompete}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                        <div className="font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                          Malus / Clawback Rules
                        </div>
                        <div className="mt-1" style={{ color: 'var(--text, #1B1E25)' }}>
                          {ag.clawback}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                        <div className="font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                          Severance / Termination Terms
                        </div>
                        <div className="mt-1" style={{ color: 'var(--text, #1B1E25)' }}>
                          {ag.severance}
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono pt-1" style={{ color: 'var(--muted, #5B6270)' }}>
                      Citation: {ag.sourceRef}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 10: PUBLIC STATEMENTS */}
            {profileTab === 'statements' && (
              <div className="border rounded-2xl p-6 print-card space-y-3" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text, #1B1E25)' }}>
                  Executive in the Public Domain
                </h3>
                {selectedKmp.publicStatements.map((st, i) => (
                  <div key={i} className="p-4 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <div>
                      <div className="font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                        {st.title}
                      </div>
                      <div className="mt-0.5" style={{ color: 'var(--muted, #5B6270)' }}>
                        {st.outlet} · {st.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <VerificationBadge status={st.provenance} onInspect={setInspectedProvenance} skinMode={skinMode} />
                      <SafeExternalLink url={st.url} label="Source" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 11: ANNOUNCEMENTS */}
            {profileTab === 'news' && (
              <div className="border rounded-2xl p-6 print-card space-y-3" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text, #1B1E25)' }}>
                  Regulatory Announcements & Company Stream
                </h3>
                {movements
                  .filter((m) => m.ticker === selectedCompany?.nseSymbol)
                  .map((m) => (
                    <div key={m.id} className="p-4 rounded-xl border text-xs" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                      <div className="font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                        {m.reason}
                      </div>
                      <div className="mt-1 font-mono" style={{ color: 'var(--muted, #5B6270)' }}>
                        {m.announcedDate} · {m.sourceRef}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* TAB 12: DOSSIER */}
            {profileTab === 'dossier' && (
              <div className="border rounded-2xl p-6 print-card space-y-5" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                      Executive 360° Evidence-Backed Research Dossier
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--muted, #5B6270)' }}>
                      Generated {new Date().toLocaleDateString()} · Analytical & governance summary; not investment advice.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="no-print inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer"
                    style={{ backgroundColor: '#087F5B' }}
                  >
                    <Printer className="w-4 h-4" /> Print / Save as PDF
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold uppercase text-emerald-700">1. Identity & Current Mandate</h4>
                    <p className="mt-1" style={{ color: 'var(--text, #1B1E25)' }}>
                      {selectedKmp.fullLegalName} (DIN: {selectedKmp.din}) — {selectedKmp.designation} at {selectedCompany?.legalName}. {selectedKmp.brief30s.mandate}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-emerald-700">2. Multi-Company Career Arc</h4>
                    <ul className="mt-1 space-y-1" style={{ color: 'var(--text, #1B1E25)' }}>
                      {selectedKmp.careerHistory.map((c, i) => (
                        <li key={i}>
                          • <strong>{c.company}</strong> — {c.designation} ({c.from} to {c.to}) [{c.provenance.status}]
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-emerald-700">3. Observed Financial & Market Metrics</h4>
                    <p className="mt-1" style={{ color: 'var(--text, #1B1E25)' }}>
                      Revenue CAGR: {origMetrics.revCagr !== null ? `${origMetrics.revCagr.toFixed(1)}%` : 'N/A'} | PAT CAGR:{' '}
                      {origMetrics.patCagr !== null ? `${origMetrics.patCagr.toFixed(1)}%` : 'N/A'} | Stock Return:{' '}
                      {origMetrics.stockReturn !== null ? `${origMetrics.stockReturn.toFixed(1)}%` : 'N/A'} vs Nifty 50:{' '}
                      {origMetrics.niftyReturn !== null ? `${origMetrics.niftyReturn.toFixed(1)}%` : 'N/A'}.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-emerald-700">4. Disclosed Contractual & Governance Provisions</h4>
                    <p className="mt-1" style={{ color: 'var(--text, #1B1E25)' }}>
                      {selectedKmp.agreements[0]
                        ? `${selectedKmp.agreements[0].type}: ${selectedKmp.agreements[0].noticePeriod}; ${selectedKmp.agreements[0].clawback} (${selectedKmp.agreements[0].sourceRef}).`
                        : 'Not Available'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 5: EXIT RADAR & INSIDER DEALS                                    */}
        {/* ===================================================================== */}
        {activeNav === 'radar' && (
          <div className="space-y-6">
            <div className="border rounded-2xl p-6 transition-colors" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text, #1B1E25)' }}>
                <AlertTriangle className="w-5 h-5 text-amber-500" /> KMP Exit Radar & Movement–Market Correlation
              </h2>
              <p className="text-xs mt-1" style={{ color: 'var(--muted, #5B6270)' }}>
                Monitors executive transitions, succession handoffs, and 5-day / 30-day post-announcement market reactions. Temporal correlation is not causal proof.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {EXIT_RADAR_SIGNALS.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-700">{s.signalType}</span>
                      <div className="flex items-center gap-1.5">
                        <StrengthBars strength={s.strength || 'Low'} skinMode={skinMode} />
                        <VerificationBadge status={s.provenance} onInspect={setInspectedProvenance} skinMode={skinMode} />
                      </div>
                    </div>
                    <div className="font-bold text-sm mt-2" style={{ color: 'var(--text, #1B1E25)' }}>
                      {s.company}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--muted, #5B6270)' }}>
                      {s.headline}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--muted, #5B6270)' }}>
                      {s.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 6: COMPANY HUB                                                   */}
        {/* ===================================================================== */}
        {activeNav === 'company' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {companies.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCompanyId(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                    c.id === selectedCompanyId ? 'text-white shadow-sm' : 'border'
                  }`}
                  style={{
                    backgroundColor: c.id === selectedCompanyId ? '#087F5B' : 'var(--bg, #FFFFFF)',
                    borderColor: 'var(--border, #E3E6EA)',
                    color: c.id === selectedCompanyId ? '#FFFFFF' : 'var(--text, #1B1E25)'
                  }}
                >
                  {c.displayName} ({c.nseSymbol})
                </button>
              ))}
            </div>

            {(() => {
              const comp = companyMap[selectedCompanyId] || companies[0];
              const compKmps = kmps.filter((k) => k.companyId === comp.id);
              return (
                <div className="border rounded-2xl p-6 space-y-5 transition-colors" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                        {comp.legalName}
                      </h2>
                      <div className="text-xs font-mono mt-1" style={{ color: 'var(--muted, #5B6270)' }}>
                        NSE: {comp.nseSymbol} · BSE: {comp.bseCode} · CIN: {comp.cin} · ISIN: {comp.isin}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleWatchlistAlert(comp.id, comp.displayName)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer"
                        style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--text, #1B1E25)' }}
                      >
                        {alertSubscriptions.includes(comp.id) ? '✓ Alerts Active' : '+ Subscribe Alerts'}
                      </button>
                      <VerificationBadge status={comp.provenance.status} meta={comp.provenance} onInspect={setInspectedProvenance} skinMode={skinMode} />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="border-b font-sans font-semibold" style={{ color: 'var(--muted, #5B6270)', borderColor: 'var(--border, #E3E6EA)' }}>
                        <tr>
                          <th className="py-2 pr-4">Fiscal Year</th>
                          <th className="py-2 pr-4">Revenue (₹ Cr)</th>
                          <th className="py-2 pr-4">EBITDA (₹ Cr)</th>
                          <th className="py-2 pr-4">PAT (₹ Cr)</th>
                          <th className="py-2 pr-4">FY Close Price (₹)</th>
                          <th className="py-2 font-sans">Nifty 50</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
                        {comp.financials.map((f) => (
                          <tr key={f.fy}>
                            <td className="py-2 pr-4 font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                              FY{f.fy}
                            </td>
                            <td className="py-2 pr-4" style={{ color: 'var(--text, #1B1E25)' }}>
                              {f.revenueCr.toLocaleString()}
                            </td>
                            <td className="py-2 pr-4" style={{ color: 'var(--muted, #5B6270)' }}>
                              {f.ebitdaCr.toLocaleString()}
                            </td>
                            <td className="py-2 pr-4 text-emerald-600 font-bold">{f.patCr.toLocaleString()}</td>
                            <td className="py-2 pr-4 text-sky-600 font-bold">{f.closePrice.toFixed(1)}</td>
                            <td className="py-2 text-amber-700 font-semibold">{f.nifty.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted, #5B6270)' }}>
                      Tracked KMPs at {comp.displayName}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {compKmps.map((k) => (
                        <button
                          key={k.id}
                          type="button"
                          onClick={() => {
                            setSelectedKmpId(k.id);
                            setActiveNav('profile');
                          }}
                          className="px-3 py-2 rounded-xl border text-left text-xs cursor-pointer hover:shadow-sm"
                          style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}
                        >
                          <div className="font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                            {k.commonName}
                          </div>
                          <div style={{ color: 'var(--muted, #5B6270)' }}>
                            {k.designation} ({k.status})
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 7: DATA CONSOLE & PILOT STATUS                                   */}
        {/* ===================================================================== */}
        {activeNav === 'data' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-2xl p-6 space-y-4" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text, #1B1E25)' }}>
                  <Database className="w-4 h-4 text-emerald-600" /> Validated CSV / JSON Data Loader
                </h2>
                <button
                  type="button"
                  onClick={resetDemoData}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Reset Starter Dataset
                </button>
              </div>
              <p className="text-xs" style={{ color: 'var(--muted, #5B6270)' }}>
                Paste CSV rows (<code className="text-emerald-700 font-bold">companyId,fy,revenueCr,ebitdaCr,patCr,closePrice,nifty</code>) or structured JSON to merge into local browser storage immediately.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setImportPayload(
                      'companyId,fy,revenueCr,ebitdaCr,patCr,closePrice,nifty\ncomp_axis,2025,146200,41850,26410,1164.2,23519'
                    )
                  }
                  className="px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--text, #1B1E25)' }}
                >
                  Load Sample CSV Template
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setImportPayload(
                      JSON.stringify(
                        {
                          companies: [
                            {
                              id: 'comp_tcs',
                              legalName: 'Tata Consultancy Services Limited',
                              displayName: 'TCS',
                              cin: 'L22210MH1995PLC084781',
                              isin: 'INE467B01029',
                              nseSymbol: 'TCS',
                              bseCode: '532540',
                              sector: 'IT Services',
                              listingStatus: 'listed',
                              governanceScore: 95,
                              kmpChurn3Yr: 'Low',
                              basis: 'CONSOLIDATED',
                              financials: [
                                { fy: 2023, revenueCr: 225458, ebitdaCr: 59259, patCr: 42147, closePrice: 3205.9, nifty: 17359 },
                                { fy: 2024, revenueCr: 240893, ebitdaCr: 64296, patCr: 45908, closePrice: 3876.3, nifty: 22326 },
                                { fy: 2025, revenueCr: 255324, ebitdaCr: 67410, patCr: 48553, closePrice: 3610.0, nifty: 23519 }
                              ],
                              provenance: {
                                sourceName: 'TCS Annual Reports FY23–FY25',
                                sourceUrl: 'https://www.tcs.com/investor-relations',
                                publicationDate: '2025-05-15',
                                pageRef: 'Consolidated Financials',
                                lastVerified: '2026-11-22',
                                status: 'Verified'
                              }
                            }
                          ]
                        },
                        null,
                        2
                      )
                    )
                  }
                  className="px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--text, #1B1E25)' }}
                >
                  Load Sample Company JSON (TCS)
                </button>
                <button
                  type="button"
                  onClick={handleExportSafeCsv}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 cursor-pointer ml-auto"
                >
                  <Download className="w-3.5 h-3.5" /> Export Safe CSV
                </button>
              </div>

              <textarea
                rows={9}
                value={importPayload}
                onChange={(e) => setImportPayload(e.target.value)}
                placeholder="Paste CSV or JSON here..."
                className="w-full border rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-emerald-600"
                style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--text, #1B1E25)' }}
              />

              <button
                type="button"
                onClick={handleValidateAndImport}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer shadow-sm"
                style={{ backgroundColor: '#087F5B' }}
              >
                Validate Schema & Merge into Workspace
              </button>

              {importFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs border font-medium ${
                    importFeedback.ok
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {importFeedback.message}
                </div>
              )}
            </div>

            <div className="border rounded-2xl p-6 space-y-4" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
              <h2 className="text-base font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                Production Architecture & 100-Company Pilot Status
              </h2>
              <p className="text-xs" style={{ color: 'var(--muted, #5B6270)' }}>
                Tracks relational database readiness, source connector permissions (no unauthorized scraping), and verification queues.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                  <div className="font-sans font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                    Pilot Listed Companies
                  </div>
                  <div className="text-lg font-bold mt-0.5" style={{ color: 'var(--text, #1B1E25)' }}>
                    {companies.length} / 100
                  </div>
                </div>
                <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                  <div className="font-sans font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                    KMP Profiles Indexed
                  </div>
                  <div className="text-lg font-bold mt-0.5" style={{ color: 'var(--text, #1B1E25)' }}>
                    {kmps.length}
                  </div>
                </div>
                <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                  <div className="font-sans font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                    Unverified Flagged Records
                  </div>
                  <div className="text-lg font-bold text-amber-700 mt-0.5">
                    {kmps.filter((k) => k.verification.status === 'Unverified').length}
                  </div>
                </div>
                <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                  <div className="font-sans font-semibold" style={{ color: 'var(--muted, #5B6270)' }}>
                    Backend Stack
                  </div>
                  <div className="text-xs font-bold text-emerald-600 mt-1.5">FastAPI · Postgres/pgvector · Celery</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                  Official Data Connector Policy
                </div>
                {[
                  { name: 'MCA OGD Company Master (data.gov.in)', state: 'Enabled · Permitted Bulk CSV', badge: 'Verified' },
                  { name: 'Nifty Indices Reference Series', state: 'Enabled · Official Reference Data', badge: 'Corroborated' },
                  { name: 'NSE / BSE Corporate Announcements', state: 'Gated · Permitted Downloads / Licensed Feed Only', badge: 'Estimated' },
                  { name: 'SEBI Circulars & Corporate Filings Index', state: 'Enabled · Official Regulatory Links', badge: 'Verified' }
                ].map((conn, idx) => (
                  <div key={idx} className="p-3 rounded-xl border flex items-center justify-between gap-2" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <div>
                      <div className="font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                        {conn.name}
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--muted, #5B6270)' }}>
                        {conn.state}
                      </div>
                    </div>
                    <VerificationBadge status={conn.badge} onInspect={setInspectedProvenance} skinMode={skinMode} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SIDE-BY-SIDE KMP COMPARISON DRAWER */}
      {showCompare && (
        <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t shadow-2xl p-4 transition-colors" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Side-by-Side KMP Comparison ({pinnedIds.length} / 4 Pinned)
              </div>
              <button
                type="button"
                onClick={() => setShowCompare(false)}
                className="text-xs font-bold cursor-pointer"
                style={{ color: 'var(--muted, #5B6270)' }}
              >
                Close ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {pinnedIds.map((id) => {
                const k = kmps.find((x) => x.id === id);
                if (!k) return null;
                const comp = companyMap[k.companyId];
                const m = computeKmpMetrics(k);
                return (
                  <div key={id} className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold" style={{ color: 'var(--text, #1B1E25)' }}>
                          {k.commonName}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--muted, #5B6270)' }}>
                          {comp?.displayName} · {k.roleArchetype}
                        </div>
                      </div>
                      <button type="button" onClick={() => togglePin(id)} className="text-rose-600 font-bold hover:underline cursor-pointer">
                        ✕
                      </button>
                    </div>
                    <div className="mt-2 space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--muted, #5B6270)' }}>Tenure:</span>
                        <span className="font-semibold" style={{ color: 'var(--text, #1B1E25)' }}>
                          {m.tenure.years}y {m.tenure.days}d
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--muted, #5B6270)' }}>Rev CAGR:</span>
                        <span className="text-emerald-600 font-bold">{m.revCagr !== null ? `${m.revCagr.toFixed(1)}%` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--muted, #5B6270)' }}>PAT CAGR:</span>
                        <span className="text-emerald-600 font-bold">{m.patCagr !== null ? `${m.patCagr.toFixed(1)}%` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--muted, #5B6270)' }}>vs Nifty 50:</span>
                        <span className="text-sky-600 font-bold">{m.alpha !== null ? `${m.alpha >= 0 ? '+' : ''}${m.alpha.toFixed(1)}%` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION PLANS MODAL (RECURRING VALUE PROPOSITION) */}
      {showPricingModal && (
        <div
          onClick={() => setShowPricingModal(false)}
          className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="border rounded-2xl p-6 max-w-2xl w-full space-y-5 shadow-2xl transition-colors"
            style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
              <div>
                <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text, #1B1E25)' }}>
                  <Award className="w-5 h-5 text-emerald-600" /> CORPINTEL Subscription Tiers — Why Analysts Renew Monthly
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted, #5B6270)' }}>
                  Complements Screener.com with human-capital forensics, Reg. 30 event triggers & governance risk alerts.
                </p>
              </div>
              <button type="button" onClick={() => setShowPricingModal(false)} className="text-xs font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border space-y-2.5" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                <div className="font-bold text-sm" style={{ color: 'var(--text, #1B1E25)' }}>
                  Free Reader
                </div>
                <div className="text-xl font-bold font-mono" style={{ color: 'var(--text, #1B1E25)' }}>
                  ₹0 <span className="text-xs font-sans font-normal">/ forever</span>
                </div>
                <ul className="space-y-1.5" style={{ color: 'var(--muted, #5B6270)' }}>
                  <li>✓ Basic KMP directory & tenure clocks</li>
                  <li>✓ Public career history & qualifications</li>
                  <li>✓ High-level governance score</li>
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setSubscriptionTier('FREE');
                    setShowPricingModal(false);
                  }}
                  className="w-full py-2 rounded-xl border font-semibold cursor-pointer mt-2"
                  style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}
                >
                  Preview Free Tier
                </button>
              </div>

              <div className="p-4 rounded-xl border-2 border-emerald-600 space-y-2.5" style={{ backgroundColor: 'var(--bg, #FFFFFF)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-700">CORPINTEL PRO</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">MOST POPULAR</span>
                </div>
                <div className="text-xl font-bold font-mono" style={{ color: 'var(--text, #1B1E25)' }}>
                  ₹1,499 <span className="text-xs font-sans font-normal">/ month</span>
                </div>
                <ul className="space-y-1.5" style={{ color: 'var(--text, #1B1E25)' }}>
                  <li>✓ Instant 15-min Reg. 30 KMP Exit & Pledge Alerts</li>
                  <li>✓ Historical 5D/30D Share-Price Catalyst Analogs</li>
                  <li>✓ Full ESOP, Clawback & Non-Compete Clause Diffs</li>
                  <li>✓ Unlimited PDF Due-Diligence Dossiers & CSV Exports</li>
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setSubscriptionTier('PRO');
                    setShowPricingModal(false);
                    triggerToast('CORPINTEL PRO activated!');
                  }}
                  className="w-full py-2 rounded-xl text-white font-bold cursor-pointer mt-2 shadow-sm"
                  style={{ backgroundColor: '#087F5B' }}
                >
                  Activate CORPINTEL PRO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROVENANCE EVIDENCE INSPECTOR MODAL */}
      {inspectedProvenance && (
        <div
          onClick={() => setInspectedProvenance(null)}
          className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="border rounded-2xl p-6 max-w-md w-full space-y-3 text-xs shadow-2xl transition-colors"
            style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider" style={{ color: 'var(--text, #1B1E25)' }}>
                Source Evidence & Provenance
              </span>
              <VerificationBadge status={inspectedProvenance.status} skinMode={skinMode} />
            </div>
            <div className="space-y-2 border rounded-xl p-4" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--text, #1B1E25)' }}>
              <div>
                <strong>Source:</strong> {inspectedProvenance.sourceName || 'Primary Regulatory / Corporate Record'}
              </div>
              <div>
                <strong>Publication Date:</strong> {inspectedProvenance.publicationDate || 'Not Recorded'}
              </div>
              <div>
                <strong>Document / Page Ref:</strong> {inspectedProvenance.pageRef || 'Filing Summary'}
              </div>
              <div>
                <strong>Last Verified:</strong> {inspectedProvenance.lastVerified || '2026-11-18'}
              </div>
              {inspectedProvenance.sourceUrl && (
                <div className="pt-1">
                  <SafeExternalLink url={inspectedProvenance.sourceUrl} label="Open Original Source URL" />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setInspectedProvenance(null);
                  setActiveNav('data');
                }}
                className="px-3.5 py-1.5 rounded-xl font-semibold border cursor-pointer hover:opacity-90"
                style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--text, #1B1E25)' }}
              >
                Patch in Data Console
              </button>
              <button
                type="button"
                onClick={() => setInspectedProvenance(null)}
                className="px-4 py-1.5 rounded-xl font-bold text-white cursor-pointer shadow-sm"
                style={{ backgroundColor: '#087F5B' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GROUNDED AI RESEARCH ASSISTANT DRAWER */}
      {aiOpen && (
        <div className="no-print fixed inset-y-0 right-0 z-50 w-full max-w-md border-l shadow-2xl flex flex-col transition-colors" style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--text, #1B1E25)' }}>
                <Sparkles className="w-4 h-4 text-emerald-600" /> Grounded Executive Research Assistant
              </div>
              <div className="text-[11px]" style={{ color: 'var(--muted, #5B6270)' }}>
                Context: <strong style={{ color: 'var(--accent, #087F5B)' }}>{selectedKmp?.commonName}</strong> · Citations enforced
              </div>
            </div>
            <button type="button" onClick={() => setAiOpen(false)} className="font-bold cursor-pointer hover:opacity-80" style={{ color: 'var(--muted, #5B6270)' }}>
              ✕
            </button>
          </div>

          <div className="p-3 border-b flex flex-wrap gap-1.5" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
            {[
              'Share-price catalysts & governance score',
              'Complete career history across previous companies',
              'Disclosed remuneration over the last 5 years',
              'Financial performance during tenure',
              'Joining & exit clauses signed'
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => runGroundedQuery(preset)}
                className="text-[11px] px-2.5 py-1 rounded-full font-semibold border transition cursor-pointer hover:shadow-sm"
                style={{ backgroundColor: 'var(--bg, #FFFFFF)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--text, #1B1E25)' }}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiHistory.length === 0 && (
              <div className="text-xs border rounded-xl p-4 font-medium" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--muted, #5B6270)' }}>
                Ask a research question above. Every factual statement is restricted to verified/corroborated records with explicit citations.
              </div>
            )}
            {aiHistory.map((item, idx) => (
              <div key={idx} className="space-y-2 border rounded-xl p-3.5 text-xs shadow-sm" style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)' }}>
                <div className="font-bold text-emerald-700">Q: {item.question}</div>
                <pre className="whitespace-pre-wrap font-sans leading-relaxed" style={{ color: 'var(--text, #1B1E25)' }}>
                  {item.answer}
                </pre>
                {item.citations.length > 0 && (
                  <div className="pt-2 border-t text-[11px] font-mono font-semibold text-emerald-800" style={{ borderColor: 'var(--border, #E3E6EA)' }}>
                    Citations: {item.citations.join(' | ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runGroundedQuery(aiPrompt);
            }}
            className="p-3 border-t flex gap-2"
            style={{ borderColor: 'var(--border, #E3E6EA)' }}
          >
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask about catalysts, career, pay, clauses..."
              className="flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600"
              style={{ backgroundColor: 'var(--surface, #F3F5F7)', borderColor: 'var(--border, #E3E6EA)', color: 'var(--text, #1B1E25)' }}
            />
            <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-sm" style={{ backgroundColor: '#087F5B' }}>
              Ask
            </button>
          </form>
        </div>
      )}
    </div>
  );
}