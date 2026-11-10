import { EconomicStory, EconomicConnection, ConnectionType } from '../../types/index.ts';

export class ConnectionDetector {
  private static historicalPrecedents = [
    {
      keywords: [/repo|reserve|liquidity spike|standing repo/i],
      era: 'September 2019 Repo Market Spike',
      description: 'Severe reserve scarcity and tax payment settlement drained dealer liquidity, causing overnight repo rates to spike to nearly 10%.',
      keySimilarity: 'Interbank reserve depletion at the Federal Reserve leaves markets sensitive to unexpected cash drains.',
      keyDifference: 'Standing Repo Facility (SRF) now operates as an active ceiling rate.'
    },
    {
      keywords: [/fx swap|cross-currency|dollar funding|swap line/i],
      era: '2008 Global Financial Crisis & March 2020 Liquidity Crunch',
      description: 'Offshore dollar shortages caused covered interest parity to collapse, requiring bilateral central bank swap lines.',
      keySimilarity: 'Non-US institutions running structural currency mismatches require central bank liquidity backstops.',
      keyDifference: 'Current exposures reside heavily in non-bank asset managers (pension funds and private debt) rather than regulated banks.'
    },
    {
      keywords: [/tariff|trade war|retaliation|export barrier|protectionism/i],
      era: '1930 Smoot-Hawley Tariff & 2018-2019 US-China Tariff Episodes',
      description: 'Unilateral tariff escalation induced retaliatory duties, resulting in global trade volume contraction and domestic manufacturing markup increases.',
      keySimilarity: 'Tit-for-tat tariff escalation and global supply chain realignment.',
      keyDifference: 'Modern supply chains feature multi-stage intermediate value-added production networks rather than finished goods trade alone.'
    },
    {
      keywords: [/stagflation|supply shock|energy price|wage-price/i],
      era: '1970s Arthur Burns Stop-Go Monetary Cycle',
      description: 'Central bank prematurely eased policy following initial disinflation, allowing inflation expectations to un-anchor and requiring Volcker-era tightening.',
      keySimilarity: 'Risk of persistent supply-side cost shocks complicating the disinflation glide path.',
      keyDifference: 'Central bank credibility and inflation-targeting mandates are far more firmly institutionalized today.'
    }
  ];

  static detectConnections(
    newStory: EconomicStory,
    existingStories: EconomicStory[]
  ): EconomicConnection[] {
    const connections: EconomicConnection[] = [];

    // 1. Check against existing archived stories
    for (const prior of existingStories) {
      if (prior.id === newStory.id) continue;

      // A. Continuation: Same institution and overlapping mechanisms
      const sharedInstitutions = newStory.institutions.filter((i) =>
        prior.institutions.includes(i)
      );
      const sharedMechanisms = newStory.mechanisms.filter((m) =>
        prior.mechanisms.includes(m)
      );

      if (sharedInstitutions.length > 0 && sharedMechanisms.length >= 2) {
        connections.push({
          id: `conn-${newStory.id}-${prior.id}-cont`,
          sourceId: newStory.id,
          targetId: prior.id,
          sourceTitle: newStory.headline,
          targetTitle: prior.headline,
          type: 'continuation',
          rationale: `Both developments involve ${sharedInstitutions.join(', ')} acting through ${sharedMechanisms.join(' and ')}. Represents evolutionary stages of the same macro regime.`,
          confidence: 'established'
        });
        continue;
      }

      // B. Theoretical connection: shared models
      const sharedFrameworks = newStory.theoreticalFrameworks.filter((f) =>
        prior.theoreticalFrameworks.some(
          (pf) => pf.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(pf.toLowerCase())
        )
      );
      if (sharedFrameworks.length > 0) {
        connections.push({
          id: `conn-${newStory.id}-${prior.id}-theo`,
          sourceId: newStory.id,
          targetId: prior.id,
          sourceTitle: newStory.headline,
          targetTitle: prior.headline,
          type: 'theoretical connection',
          rationale: `Both episodes are interpreted through the theoretical lens of ${sharedFrameworks[0]}, providing comparative empirical evidence across jurisdictions.`,
          confidence: 'established'
        });
        continue;
      }

      // C. Contradictory evidence: different jurisdictions taking opposing policy paths
      if (
        newStory.jurisdiction !== prior.jurisdiction &&
        newStory.classification.some((c) => prior.classification.includes(c)) &&
        ((newStory.headline.toLowerCase().includes('cut') && prior.headline.toLowerCase().includes('hike')) ||
          (newStory.headline.toLowerCase().includes('taper') && prior.headline.toLowerCase().includes('deploy')))
      ) {
        connections.push({
          id: `conn-${newStory.id}-${prior.id}-contra`,
          sourceId: newStory.id,
          targetId: prior.id,
          sourceTitle: newStory.headline,
          targetTitle: prior.headline,
          type: 'contradictory evidence',
          rationale: `Divergent macroeconomic stances between ${newStory.jurisdiction} and ${prior.jurisdiction} demonstrate asymmetric cyclical pressures and cross-border policy divergence.`,
          confidence: 'established'
        });
      }
    }

    // 2. Check for historical analogies
    const fullStoryText = `${newStory.headline} ${newStory.factualSummary} ${newStory.theoreticalFrameworks.join(' ')}`;
    for (const prec of this.historicalPrecedents) {
      if (prec.keywords.some((kw) => kw.test(fullStoryText))) {
        connections.push({
          id: `conn-${newStory.id}-hist-${prec.era.replace(/[^a-zA-Z0-9]/g, '')}`,
          sourceId: newStory.id,
          targetId: `hist-${prec.era.replace(/[^a-zA-Z0-9]/g, '')}`,
          sourceTitle: newStory.headline,
          targetTitle: prec.era,
          type: 'historical analogy',
          rationale: `Structural mechanics bear strong analogy to the ${prec.era}. Caution: Correlation and historical surface similarities do not guarantee identical macroeconomic outcomes.`,
          historicalPrecedent: {
            era: prec.era,
            description: prec.description,
            keySimilarity: prec.keySimilarity,
            keyDifference: prec.keyDifference
          },
          confidence: 'analogous'
        });
        break; // at most one dominant historical analogy per story to prevent clutter
      }
    }

    return connections;
  }
}
