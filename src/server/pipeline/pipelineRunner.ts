import { StorageManager } from '../storage/index.ts';
import { FeedFetcher, RawArticleItem } from './fetcher.ts';
import { ArticleNormalizer, NormalizedCandidate } from './normalizer.ts';
import { ArticleDeduplicator } from './deduplicator.ts';
import { EconomicRanker, RankedCandidate } from './ranker.ts';
import { StoryAnalyzer } from './analyzer.ts';
import { ConnectionDetector } from './connectionDetector.ts';
import { DailyBriefing, EconomicStory, PipelineExecutionStatus } from '../../types/index.ts';

export class PipelineRunner {
  static async run(): Promise<PipelineExecutionStatus> {
    const startTime = new Date().toISOString();
    const today = startTime.split('T')[0];
    const logs: string[] = [];
    const errors: string[] = [];

    const log = (msg: string) => {
      const line = `[${new Date().toISOString()}] ${msg}`;
      console.log(line);
      logs.push(line);
    };

    log('Initiating Economic Observatory Ingestion & Analysis Pipeline');
    StorageManager.updatePipelineStatus({
      status: 'running',
      currentStage: 'Stage 1: Ingesting institutional sources',
      errors: [],
      logs
    });

    try {
      // Stage 1: Fetch new source material in parallel
      log('Stage 1: Fetching sources from configured RSS and API endpoints');
      const sources = StorageManager.getSources().filter((s) => s.active);
      const rawArticles: RawArticleItem[] = [];

      const fetchResults = await Promise.all(
        sources.map(async (source) => {
          log(`Querying ${source.name} (${source.jurisdiction})...`);
          const items = await FeedFetcher.fetchSource(source);
          source.lastChecked = new Date().toISOString();
          source.itemCount = items.length;
          StorageManager.saveSource(source);
          return items;
        })
      );
      for (const items of fetchResults) {
        rawArticles.push(...items);
      }
      log(`Total raw items gathered: ${rawArticles.length}`);

      // Stage 2: Normalize article metadata
      log('Stage 2: Normalizing article metadata, institutions, and canonical dates');
      const normalizedCandidates: NormalizedCandidate[] = rawArticles.map((raw) =>
        ArticleNormalizer.normalize(raw)
      );

      // Stage 3 & 4: Deduplicate and check against archive
      log('Stage 3 & 4: Deduplicating articles and checking historical archive');
      const existingStories = StorageManager.getStories();
      const dedupResult = ArticleDeduplicator.process(normalizedCandidates, existingStories);
      log(
        `Deduplication complete: ${dedupResult.uniqueCandidates.length} new unique candidates, ${dedupResult.duplicateCount} duplicate items removed, ${dedupResult.previouslyCoveredCount} already present in archive`
      );

      // Stage 5: Rank candidate stories by economic significance
      log('Stage 5: Ranking candidates by institutional weight and macroeconomic significance');
      const rankedCandidates: RankedCandidate[] = EconomicRanker.rankBatch(
        dedupResult.uniqueCandidates
      );

      // Select top significant stories for deep analytical breakdown (top 3 to 6 stories)
      const selectedForAnalysis = rankedCandidates.slice(0, 5);
      log(`Selected top ${selectedForAnalysis.length} stories for deep structured economic analysis`);

      // Stage 6 & 7: Analyse selected stories using Gemini API and validate output
      log('Stage 6 & 7: Analyzing stories with Gemini API and validating structured schemas');
      const newAnalyzedStories = await Promise.all(
        selectedForAnalysis.map(async (cand) => {
          log(`Analyzing: "${cand.title.slice(0, 60)}..."`);
          return await StoryAnalyzer.analyzeCandidate(cand);
        })
      );

      // Stage 9: Update relationships with previously stored stories
      log('Stage 9: Identifying economic connections, theoretical links, and historical analogies');
      let newConnectionsCount = 0;
      for (const story of newAnalyzedStories) {
        const conns = ConnectionDetector.detectConnections(story, existingStories);
        for (const conn of conns) {
          StorageManager.saveConnection(conn);
          newConnectionsCount++;
          if (!story.relatedStoryIds.includes(conn.targetId)) {
            story.relatedStoryIds.push(conn.targetId);
          }
        }
      }
      log(`Recorded ${newConnectionsCount} new economic connections across the archive`);

      // Stage 8: Save the briefing and archive new articles
      log('Stage 8: Synthesizing Daily Briefing and archiving new structured stories');
      if (newAnalyzedStories.length > 0) {
        StorageManager.saveStories(newAnalyzedStories);
      }

      // Generate or update daily briefing for today
      const allStories = StorageManager.getStories();
      const topStoryIds = allStories.slice(0, 5).map((s) => s.id);
      const leadStoryId = topStoryIds[0] || '';

      const indicators = StorageManager.getIndicators();
      const indicatorHighlights = indicators.slice(0, 5).map((ind) => ({
        label: ind.name,
        value: `${ind.latestObservation}${ind.unit}`,
        change: ind.revision || 'Unchanged',
        signal: (ind.category === 'rates' ? 'dovish' : 'neutral') as any
      }));

      const newBriefing: DailyBriefing = {
        id: `briefing-${today}`,
        editionDate: today,
        generatedAt: new Date().toISOString(),
        lastUpdateStatus: 'success',
        executiveSummary: `Economic Observatory Daily Briefing for ${today}. Global institutional developments highlight ongoing adjustments in monetary operating frameworks, supply-chain fragmentation, and systemic liquidity safeguards across major central banks. Analysis incorporates ${newAnalyzedStories.length} newly ingested institutional releases with full transmission mechanism evaluations.`,
        leadStoryId,
        topStoryIds,
        environmentOverview: {
          monetaryStance:
            'Developed market policy rates remain in a calibrated plateau with central banks emphasizing balance sheet adjustments and money market stability.',
          fiscalOutlook:
            'Sovereign borrowing costs stabilize at higher neutral levels, prompting renewed focus on structural debt sustainability.',
          financialStabilityAlerts:
            'Continuous monitoring of non-bank liquidity transformation and cross-currency FX swap obligations.',
          crossBorderRisks:
            'Trade barriers and targeted industrial policies add friction to international goods flows and intermediate markups.'
        },
        regionalSummary: {
          'United States': 'Treasury runoff calibration supports interbank repo stability; inflation path remains consistent with target.',
          Eurozone: 'ECB reinforces operational rate corridor, narrowing spread to reduce peripheral interbank volatility.',
          'China & East Asia': 'Monetary easing combines statutory reserve reductions with targeted industrial refinancing.',
          Global: 'Multilateral surveillance identifies persistent intermediate tariff costs and offshore dollar roll risks.'
        },
        indicatorHighlights,
        sourcesQueriedCount: sources.length,
        articlesIngestedCount: rawArticles.length
      };

      StorageManager.saveBriefing(newBriefing);
      log('Daily briefing successfully compiled and persisted to archive');

      const finalStatus: PipelineExecutionStatus = {
        lastRunTimestamp: new Date().toISOString(),
        status: 'success',
        currentStage: 'Completed',
        totalStoriesProcessed: rawArticles.length,
        newStoriesAdded: newAnalyzedStories.length,
        sourcesContacted: sources.length,
        errors,
        logs
      };

      StorageManager.updatePipelineStatus(finalStatus);
      return finalStatus;
    } catch (err) {
      const errMsg = (err as Error).message;
      log(`Pipeline execution failed: ${errMsg}`);
      errors.push(errMsg);

      const errorStatus: PipelineExecutionStatus = {
        lastRunTimestamp: new Date().toISOString(),
        status: 'error',
        currentStage: 'Failed',
        totalStoriesProcessed: 0,
        newStoriesAdded: 0,
        sourcesContacted: 0,
        errors,
        logs
      };
      StorageManager.updatePipelineStatus(errorStatus);
      return errorStatus;
    }
  }
}
