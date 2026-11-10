import { NormalizedCandidate } from './normalizer.ts';
import { EconomicStory } from '../../types/index.ts';

export interface DeduplicationResult {
  uniqueCandidates: NormalizedCandidate[];
  duplicateCount: number;
  previouslyCoveredCount: number;
  alreadyArchivedIds: string[];
}

export class ArticleDeduplicator {
  /**
   * Calculates word Jaccard similarity between two normalized strings
   */
  static jaccardSimilarity(strA: string, strB: string): number {
    const wordsA = new Set(strA.split(/\s+/).filter((w) => w.length > 2));
    const wordsB = new Set(strB.split(/\s+/).filter((w) => w.length > 2));
    if (wordsA.size === 0 || wordsB.size === 0) return 0;

    let intersection = 0;
    for (const w of wordsA) {
      if (wordsB.has(w)) intersection++;
    }
    const union = new Set([...wordsA, ...wordsB]).size;
    return union === 0 ? 0 : intersection / union;
  }

  /**
   * Stage 3 & 4: Deduplicate candidates against each other and against existing archive stories
   */
  static process(
    candidates: NormalizedCandidate[],
    existingStories: EconomicStory[]
  ): DeduplicationResult {
    const unique: NormalizedCandidate[] = [];
    const seenUrls = new Set<string>();
    const seenTitles: string[] = [];
    const alreadyArchivedIds: string[] = [];
    let duplicateCount = 0;
    let previouslyCoveredCount = 0;

    // Build index of existing stories
    const existingNormalized = existingStories.map((s) => ({
      id: s.id,
      title: s.headline.toLowerCase().replace(/[^a-z0-9\s]/g, ''),
      url: s.sourceUrl
    }));

    for (const candidate of candidates) {
      // Check exact URL match in batch
      if (seenUrls.has(candidate.sourceUrl)) {
        duplicateCount++;
        continue;
      }

      // Check if covered in previous archive
      const exactArchiveMatch = existingNormalized.find(
        (arch) =>
          arch.url === candidate.sourceUrl ||
          this.jaccardSimilarity(arch.title, candidate.normalizedTitle) > 0.75
      );

      if (exactArchiveMatch) {
        previouslyCoveredCount++;
        alreadyArchivedIds.push(exactArchiveMatch.id);
        continue;
      }

      // Check within-batch high similarity
      let isBatchDuplicate = false;
      for (const seen of seenTitles) {
        if (this.jaccardSimilarity(seen, candidate.normalizedTitle) > 0.75) {
          isBatchDuplicate = true;
          break;
        }
      }

      if (isBatchDuplicate) {
        duplicateCount++;
        continue;
      }

      seenUrls.add(candidate.sourceUrl);
      seenTitles.push(candidate.normalizedTitle);
      unique.push(candidate);
    }

    return {
      uniqueCandidates: unique,
      duplicateCount,
      previouslyCoveredCount,
      alreadyArchivedIds
    };
  }
}
