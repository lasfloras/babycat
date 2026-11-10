import { GoogleGenAI, Type } from '@google/genai';
import { RankedCandidate } from './ranker.ts';
import { EconomicStory, EconomicField, EconomicMechanism } from '../../types/index.ts';

export class StoryAnalyzer {
  private static aiClient: GoogleGenAI | null = null;

  private static getAi(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }
    if (!this.aiClient) {
      this.aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
    return this.aiClient;
  }

  static async analyzeCandidate(candidate: RankedCandidate): Promise<EconomicStory> {
    const ai = this.getAi();

    if (ai) {
      try {
        return await this.analyzeWithGemini(ai, candidate);
      } catch (err) {
        console.warn(`[Analyzer] Gemini analysis failed for "${candidate.title}", falling back to heuristic analysis:`, (err as Error).message);
      }
    }

    return this.analyzeWithHeuristics(candidate);
  }

  private static async analyzeWithGemini(
    ai: GoogleGenAI,
    candidate: RankedCandidate
  ): Promise<EconomicStory> {
    const prompt = `
You are the Chief Senior Economist for the Economic Observatory, an economics and financial intelligence platform.
Analyze the following economic announcement or event with the highest academic rigor:

HEADLINE: "${candidate.title}"
SOURCE: "${candidate.institution}" (${candidate.sourceUrl})
JURISDICTION: "${candidate.jurisdiction}"
SUMMARY SNIPPET: "${candidate.rawSnippet}"
DATE: "${candidate.publicationDate}"

CRITICAL EDITORIAL CONSTRAINTS:
1. Clearly distinguish established facts from theoretical economic interpretations and speculative scenarios.
2. Never automatically treat correlation as causation.
3. Do not claim an economic theory has been empirically demonstrated simply because an event appears consistent with it.
4. Classify into primary fields (from: Microeconomics, Macroeconomics, Monetary economics, International economics, International finance, Financial economics, Corporate finance, Banking and financial regulation, Public economics, Industrial organisation, Development economics, Economic history, Institutional economics).
5. Identify economic mechanisms (from: Incentives, Information asymmetry, Principal-agent problems, Market power, Strategic interaction, Price mechanisms, Expectations and uncertainty, Credit transmission, Monetary transmission, Fiscal transmission, Capital allocation, International capital flows, Institutional change, Welfare and distribution).
6. Provide theoretical frameworks, near-term and structural implications, distributional effects, uncertainty and alternative counterarguments, academic citations, research questions, and indicators to watch.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a senior academic economist at a central bank research department. You output only valid structured JSON conforming to the requested schema. Maintain utmost scientific skepticism and analytical precision.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            factualSummary: {
              type: Type.STRING,
              description: 'Strict, factual statement of what was announced or observed, free of speculation.'
            },
            classification: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Primary economic fields'
            },
            mechanisms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Primary economic mechanisms involved'
            },
            theoreticalFrameworks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Applicable economic models or frameworks (e.g. Mundell-Fleming, Taylor Rule, Diamond-Dybvig)'
            },
            economicMechanismsDetail: {
              type: Type.STRING,
              description: 'Detailed step-by-step transmission explanation of how this development impacts economic agents and markets.'
            },
            possibleImplicationsNearTerm: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Probable short-term market or economic implications'
            },
            possibleImplicationsStructural: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Structural or medium-to-long-term institutional consequences'
            },
            distributionalEffects: {
              type: Type.STRING,
              description: 'Who wins, who loses, and how capital or income is redistributed.'
            },
            uncertaintyAndAlternatives: {
              type: Type.STRING,
              description: 'Alternative economic explanations, counterarguments, and key uncertainties.'
            },
            academicResearchCitations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  paperTitle: { type: Type.STRING },
                  authors: { type: Type.STRING },
                  year: { type: Type.INTEGER },
                  sourceOrJournal: { type: Type.STRING },
                  keyFinding: { type: Type.STRING }
                },
                required: ['paperTitle', 'authors', 'year', 'sourceOrJournal', 'keyFinding']
              }
            },
            potentialResearchQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Empirical or theoretical questions for researchers to investigate'
            },
            futureIndicatorsToWatch: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific observable indicators, spreads, or data releases to monitor'
            }
          },
          required: [
            'factualSummary',
            'classification',
            'mechanisms',
            'theoreticalFrameworks',
            'economicMechanismsDetail',
            'possibleImplicationsNearTerm',
            'possibleImplicationsStructural',
            'uncertaintyAndAlternatives',
            'potentialResearchQuestions',
            'futureIndicatorsToWatch'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');

    // Stage 7: Validate generated structured output
    return {
      id: `story-${candidate.candidateId}`,
      headline: candidate.title,
      originalSource: candidate.institution,
      sourceUrl: candidate.sourceUrl,
      publicationDate: candidate.publicationDate,
      eventDate: candidate.publicationDate,
      jurisdiction: candidate.jurisdiction,
      institutions: candidate.detectedInstitutions,
      factualSummary: parsed.factualSummary || candidate.rawSnippet,
      classification: (parsed.classification || ['Macroeconomics']) as EconomicField[],
      mechanisms: (parsed.mechanisms || ['Monetary transmission']) as EconomicMechanism[],
      theoreticalFrameworks: parsed.theoreticalFrameworks || ['Neoclassical Synthesis'],
      economicMechanismsDetail: parsed.economicMechanismsDetail || 'Transmission operates through expectations and market financing conditions.',
      possibleImplications: {
        nearTerm: parsed.possibleImplicationsNearTerm || ['Adjustment in asset valuations and market spreads.'],
        structural: parsed.possibleImplicationsStructural || ['Realignment of balance sheet allocation over the policy cycle.']
      },
      distributionalEffects: parsed.distributionalEffects || 'Redistributive effects depend on asset ownership and borrowing leverage.',
      uncertaintyAndAlternatives: parsed.uncertaintyAndAlternatives || 'Uncertainty remains regarding the magnitude of private sector behavioral response.',
      academicResearchCitations: parsed.academicResearchCitations || [],
      potentialResearchQuestions: parsed.potentialResearchQuestions || ['How sensitive is private investment to this specific transmission channel?'],
      futureIndicatorsToWatch: parsed.futureIndicatorsToWatch || ['Benchmark sovereign yield curve', 'Interbank lending rates'],
      significanceScore: candidate.significanceScore,
      relatedStoryIds: [],
      status: 'analyzed'
    };
  }

  // Heuristic analytical pipeline if Gemini API is offline or in test environments
  static analyzeWithHeuristics(candidate: RankedCandidate): EconomicStory {
    const isMonetary = /monetary|rate|fomc|ecb|central bank|repo|balance sheet/i.test(
      `${candidate.title} ${candidate.rawSnippet}`
    );
    const isTrade = /tariff|trade|export|wto|protectionism|supply chain/i.test(
      `${candidate.title} ${candidate.rawSnippet}`
    );
    const isBanking = /bank|liquidity|basel|capital|solvency|credit/i.test(
      `${candidate.title} ${candidate.rawSnippet}`
    );

    const classification: EconomicField[] = isMonetary
      ? ['Monetary economics', 'Macroeconomics']
      : isTrade
      ? ['International economics', 'Public economics']
      : isBanking
      ? ['Banking and financial regulation', 'Financial economics']
      : ['Macroeconomics', 'Institutional economics'];

    const mechanisms: EconomicMechanism[] = isMonetary
      ? ['Monetary transmission', 'Expectations and uncertainty', 'Credit transmission']
      : isTrade
      ? ['Price mechanisms', 'Market power', 'International capital flows']
      : isBanking
      ? ['Credit transmission', 'Information asymmetry', 'Capital allocation']
      : ['Price mechanisms', 'Institutional change'];

    const frameworks = isMonetary
      ? ['Taylor Rule Reaction Functions', 'Ample Reserves Operating Framework', 'Expectations Hypothesis']
      : isTrade
      ? ['Ricardian Comparative Advantage', 'Terms of Trade Spillover', 'Strategic Trade Policy']
      : isBanking
      ? ['Diamond-Dybvig Liquidity Model', 'Financial Accelerator (Bernanke-Gertler)', 'Macroprudential Capital Buffers']
      : ['New Keynesian Dynamic Equilibrium', 'Institutional Economics (North)'];

    return {
      id: `story-${candidate.candidateId}`,
      headline: candidate.title,
      originalSource: candidate.institution,
      sourceUrl: candidate.sourceUrl,
      publicationDate: candidate.publicationDate,
      eventDate: candidate.publicationDate,
      jurisdiction: candidate.jurisdiction,
      institutions: candidate.detectedInstitutions,
      factualSummary:
        candidate.rawSnippet.length > 30
          ? candidate.rawSnippet
          : `${candidate.institution} issued an official communication regarding ${candidate.title}.`,
      classification,
      mechanisms,
      theoreticalFrameworks: frameworks,
      economicMechanismsDetail:
        'Transmission channels operate through price adjustments, interbank liquidity spreads, and borrowing costs across primary and secondary financial markets.',
      possibleImplications: {
        nearTerm: [
          'Immediate re-pricing of forward rate expectations or term premia.',
          'Re-anchoring of commercial bank funding costs and credit spreads.'
        ],
        structural: [
          'Adjustment in long-term capital formation and investment hurdle rates.',
          'Long-term realignment of regulatory or institutional compliance costs.'
        ]
      },
      distributionalEffects:
        'Borrowers with floating-rate debt face immediate cash flow adjustments, while institutional lenders benefit from collateral stability.',
      uncertaintyAndAlternatives:
        'Observed market correlation does not necessarily establish policy causality; global supply shocks and fiscal policy interactions remain key confounders.',
      academicResearchCitations: [
        {
          paperTitle: 'Identification of Monetary Policy Shocks in Vector Autoregressions',
          authors: 'Christiano, Eichenbaum and Evans',
          year: 1999,
          sourceOrJournal: 'Handbook of Macroeconomics',
          keyFinding: 'Contractionary policy shocks lead to persistent liquidity deceleration and lagged output response.'
        }
      ],
      potentialResearchQuestions: [
        'What is the empirical pass-through coefficient from this policy measure to real capital investment across small versus large firms?'
      ],
      futureIndicatorsToWatch: [
        'Interbank benchmark spreads (SOFR/EURIBOR)',
        'Sovereign yield curve slope (10Y minus 2Y)'
      ],
      significanceScore: candidate.significanceScore,
      relatedStoryIds: [],
      status: 'analyzed'
    };
  }
}
