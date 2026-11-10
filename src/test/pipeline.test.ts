import test from 'node:test';
import assert from 'node:assert/strict';
import { ArticleNormalizer } from '../server/pipeline/normalizer.ts';
import { ArticleDeduplicator } from '../server/pipeline/deduplicator.ts';
import { EconomicRanker } from '../server/pipeline/ranker.ts';
import { ConnectionDetector } from '../server/pipeline/connectionDetector.ts';
import { EconomicStory } from '../types/index.ts';

test('ArticleNormalizer correctly normalizes title, dates, and extracts institutions', () => {
  const raw = {
    title: '<b>Federal Reserve</b> Board announces FOMC balance sheet decision &amp; QT pace',
    link: 'https://federalreserve.gov/press.htm',
    description: 'Statement from the Federal Open Market Committee.',
    pubDate: '2026-11-04T18:00:00Z',
    sourceId: 'fed',
    institution: 'Federal Reserve',
    jurisdiction: 'United States'
  };

  const candidate = ArticleNormalizer.normalize(raw);
  assert.equal(candidate.publicationDate, '2026-11-04');
  assert.equal(candidate.title, 'Federal Reserve Board announces FOMC balance sheet decision & QT pace');
  assert.ok(candidate.detectedInstitutions.includes('Federal Reserve'));
  assert.ok(candidate.normalizedTitle.includes('federal reserve board announces'));
});

test('ArticleDeduplicator filters exact duplicates and detects archived stories', () => {
  const candidateInArchive = ArticleNormalizer.normalize({
    title: 'European Central Bank lowers deposit rate by 25 bps',
    link: 'https://ecb.europa.eu/release-archived',
    description: 'ECB rate decision',
    pubDate: '2026-11-05',
    sourceId: 'ecb',
    institution: 'ECB',
    jurisdiction: 'Eurozone'
  });

  const candidateNewA = ArticleNormalizer.normalize({
    title: 'Federal Reserve pauses rate cuts amid sticky services inflation',
    link: 'https://federalreserve.gov/release-new',
    description: 'Fed rate pause',
    pubDate: '2026-11-05',
    sourceId: 'fed',
    institution: 'Federal Reserve',
    jurisdiction: 'United States'
  });

  const candidateNewADup = ArticleNormalizer.normalize({
    title: 'Federal Reserve pauses rate cuts amid sticky services inflation',
    link: 'https://federalreserve.gov/release-new',
    description: 'Duplicate story identical URL',
    pubDate: '2026-11-05',
    sourceId: 'fed',
    institution: 'Federal Reserve',
    jurisdiction: 'United States'
  });

  const existingStory: Partial<EconomicStory> = {
    id: 'story-existing',
    headline: 'European Central Bank lowers deposit rate by 25 bps',
    sourceUrl: 'https://ecb.europa.eu/release-archived'
  };

  const res = ArticleDeduplicator.process(
    [candidateInArchive, candidateNewA, candidateNewADup],
    [existingStory as EconomicStory]
  );
  assert.equal(res.uniqueCandidates.length, 1);
  assert.equal(res.previouslyCoveredCount, 1);
  assert.equal(res.duplicateCount, 1);
});

test('EconomicRanker assigns higher significance to primary central bank policy actions', () => {
  const candFed = ArticleNormalizer.normalize({
    title: 'Federal Reserve enacts balance sheet quantitative tightening taper and cuts policy rate',
    link: 'https://fed.gov/1',
    description: 'FOMC announcement regarding repo markets and rates',
    pubDate: '2026-11-05',
    sourceId: 'fed',
    institution: 'Federal Reserve',
    jurisdiction: 'United States'
  });

  const candMinor = ArticleNormalizer.normalize({
    title: 'Local commercial chamber discusses municipal retail parking fees',
    link: 'https://local.org/1',
    description: 'Discussion on parking',
    pubDate: '2026-11-05',
    sourceId: 'local',
    institution: 'Municipal Chamber',
    jurisdiction: 'Local'
  });

  const rankedFed = EconomicRanker.rank(candFed);
  const rankedMinor = EconomicRanker.rank(candMinor);

  assert.ok(rankedFed.significanceScore >= 80, `Expected Fed score >= 80, got ${rankedFed.significanceScore}`);
  assert.ok(rankedMinor.significanceScore < 60, `Expected minor score < 60, got ${rankedMinor.significanceScore}`);
});

test('ConnectionDetector detects continuation and historical analogies', () => {
  const storyFed: EconomicStory = {
    id: 'story-fed-test',
    headline: 'Federal Reserve Calibrates Balance Sheet Runoff as Overnight Repo Reserves Tighten',
    originalSource: 'Federal Reserve',
    sourceUrl: 'https://fed.gov/test',
    publicationDate: '2026-11-05',
    jurisdiction: 'United States',
    institutions: ['Federal Reserve'],
    factualSummary: 'The FOMC adjusted quantitative tightening parameters.',
    classification: ['Monetary economics', 'Macroeconomics'],
    mechanisms: ['Monetary transmission', 'Credit transmission', 'Capital allocation'],
    theoreticalFrameworks: ['Ample Reserves Operating Framework'],
    economicMechanismsDetail: 'Testing transmission',
    possibleImplications: { nearTerm: [], structural: [] },
    uncertaintyAndAlternatives: 'None',
    academicResearchCitations: [],
    potentialResearchQuestions: [],
    futureIndicatorsToWatch: [],
    significanceScore: 90,
    relatedStoryIds: [],
    status: 'analyzed'
  };

  const priorFedStory: EconomicStory = {
    id: 'story-prior-fed',
    headline: 'Federal Reserve Notes Reserve Balances Approaching Comfort Level',
    originalSource: 'Federal Reserve',
    sourceUrl: 'https://fed.gov/prior',
    publicationDate: '2026-10-01',
    jurisdiction: 'United States',
    institutions: ['Federal Reserve'],
    factualSummary: 'Prior report on liquidity.',
    classification: ['Monetary economics', 'Macroeconomics'],
    mechanisms: ['Monetary transmission', 'Credit transmission', 'Expectations and uncertainty'],
    theoreticalFrameworks: ['Ample Reserves Operating Framework'],
    economicMechanismsDetail: 'Prior detail',
    possibleImplications: { nearTerm: [], structural: [] },
    uncertaintyAndAlternatives: 'None',
    academicResearchCitations: [],
    potentialResearchQuestions: [],
    futureIndicatorsToWatch: [],
    significanceScore: 85,
    relatedStoryIds: [],
    status: 'analyzed'
  };

  const connections = ConnectionDetector.detectConnections(storyFed, [priorFedStory]);
  assert.ok(connections.length >= 1, 'Should establish at least one connection');

  const continuation = connections.find((c) => c.type === 'continuation');
  assert.ok(continuation, 'Should detect continuation connection');
  assert.equal(continuation?.sourceId, 'story-fed-test');
  assert.equal(continuation?.targetId, 'story-prior-fed');

  // Should also detect historical analogy to September 2019 repo spike
  const analogy = connections.find((c) => c.type === 'historical analogy');
  assert.ok(analogy, 'Should detect historical analogy for repo reserve spike');
  assert.ok(analogy?.historicalPrecedent?.era.includes('2019'));
});
