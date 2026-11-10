import { NormalizedCandidate } from './normalizer.ts';

export interface RankedCandidate extends NormalizedCandidate {
  significanceScore: number;
  rankingRationale: string;
}

export class EconomicRanker {
  private static highImpactInstitutions = [
    'Federal Reserve',
    'European Central Bank',
    'Bank for International Settlements',
    'International Monetary Fund',
    "People's Bank of China",
    'Bank of Japan',
    'Bank of England',
    'NBER',
    'CEPR'
  ];

  private static keyTopics = [
    { pattern: /balance sheet|quantitative (tightening|easing)|reserve balance|repo\b|sofr/i, weight: 25, label: 'Central Bank Balance Sheet & Money Markets' },
    { pattern: /interest rate|policy rate|fomc|governing council|monetary policy|rate cut|rate hike/i, weight: 24, label: 'Monetary Policy Stance' },
    { pattern: /inflation|cpi|pce|deflation|wage growth|price stability/i, weight: 20, label: 'Inflation Dynamics' },
    { pattern: /banking regulation|capital requirement|basel|systemic risk|solvency|liquidity coverage/i, weight: 22, label: 'Banking & Financial Stability' },
    { pattern: /sovereign debt|fiscal deficit|treasury issuance|yield curve|bond spread/i, weight: 20, label: 'Fiscal & Sovereign Debt Transmission' },
    { pattern: /foreign exchange|fx swap|currency swap|dollar funding|cross-currency/i, weight: 24, label: 'International Financial Architecture' },
    { pattern: /tariff|trade barrier|export control|sanction|fragmentation|nearshoring/i, weight: 22, label: 'International Trade & Geopolitics' },
    { pattern: /working paper|empirical study|econometric|identification strategy/i, weight: 18, label: 'Academic Empirical Research' }
  ];

  static rank(candidate: NormalizedCandidate): RankedCandidate {
    let score = 20; // baseline score
    const matchedReasons: string[] = [];

    // 1. Institutional authority weight
    const isPrimaryInst = this.highImpactInstitutions.some(
      (inst) =>
        candidate.institution.includes(inst) ||
        candidate.detectedInstitutions.includes(inst)
    );
    if (isPrimaryInst) {
      score += 30;
      matchedReasons.push(`Primary institutional authority (${candidate.institution})`);
    }

    // 2. High-impact economic topic matches
    const fullText = `${candidate.title} ${candidate.rawSnippet}`;
    for (const topic of this.keyTopics) {
      if (topic.pattern.test(fullText)) {
        score += topic.weight;
        matchedReasons.push(topic.label);
      }
    }

    // 3. Decisive policy action phrasing
    if (/enacts|adopts|moderates|cuts|hikes|deploys|restructures|tapers|curtails/i.test(candidate.title)) {
      score += 10;
      matchedReasons.push('Definitive policy execution');
    }

    // Cap between 1 and 99
    const finalScore = Math.min(99, Math.max(15, score));
    const rankingRationale = matchedReasons.length > 0 ? matchedReasons.join('; ') : 'General economic development';

    return {
      ...candidate,
      significanceScore: finalScore,
      rankingRationale
    };
  }

  static rankBatch(candidates: NormalizedCandidate[]): RankedCandidate[] {
    return candidates
      .map((c) => this.rank(c))
      .sort((a, b) => b.significanceScore - a.significanceScore);
  }
}
