import { RawArticleItem } from './fetcher.ts';

export interface NormalizedCandidate {
  candidateId: string;
  title: string;
  normalizedTitle: string;
  sourceUrl: string;
  publicationDate: string; // YYYY-MM-DD
  rawSnippet: string;
  sourceId: string;
  institution: string;
  jurisdiction: string;
  detectedInstitutions: string[];
}

export class ArticleNormalizer {
  static cleanHtml(text: string): string {
    return text
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  static normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static parseDate(dateStr: string): string {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    } catch {
      // ignore
    }
    return new Date().toISOString().split('T')[0];
  }

  static extractInstitutions(text: string, defaultInstitution: string): string[] {
    const list = new Set<string>();
    if (defaultInstitution) list.add(defaultInstitution);

    const patterns: Array<[RegExp, string]> = [
      [/Federal Reserve|FOMC|Fed\b/i, 'Federal Reserve'],
      [/European Central Bank|ECB\b/i, 'European Central Bank'],
      [/Bank for International Settlements|BIS\b/i, 'Bank for International Settlements'],
      [/International Monetary Fund|IMF\b/i, 'International Monetary Fund'],
      [/People's Bank of China|PBOC\b/i, "People's Bank of China"],
      [/Bank of England|BoE\b/i, 'Bank of England'],
      [/Bank of Japan|BOJ\b/i, 'Bank of Japan'],
      [/OECD\b/i, 'OECD'],
      [/World Bank\b/i, 'World Bank'],
      [/Bureau of Labor Statistics|BLS\b/i, 'Bureau of Labor Statistics'],
      [/Bureau of Economic Analysis|BEA\b/i, 'Bureau of Economic Analysis'],
      [/NBER\b/i, 'NBER'],
      [/CEPR\b/i, 'CEPR']
    ];

    for (const [regex, inst] of patterns) {
      if (regex.test(text)) {
        list.add(inst);
      }
    }

    return Array.from(list);
  }

  static normalize(raw: RawArticleItem): NormalizedCandidate {
    const cleanTitle = this.cleanHtml(raw.title);
    const cleanDesc = this.cleanHtml(raw.description);
    const pubDate = this.parseDate(raw.pubDate);
    const normalizedTitle = this.normalizeTitle(cleanTitle);
    const detectedInstitutions = this.extractInstitutions(
      `${cleanTitle} ${cleanDesc}`,
      raw.institution
    );

    // Stable candidate hash
    const candidateId = `cand-${Math.abs(
      normalizedTitle.split('').reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0)
    ).toString(36)}`;

    return {
      candidateId,
      title: cleanTitle,
      normalizedTitle,
      sourceUrl: raw.link,
      publicationDate: pubDate,
      rawSnippet: cleanDesc,
      sourceId: raw.sourceId,
      institution: raw.institution,
      jurisdiction: raw.jurisdiction,
      detectedInstitutions
    };
  }
}
