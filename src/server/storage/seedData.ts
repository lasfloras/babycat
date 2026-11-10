import {
  EconomicStory,
  DailyBriefing,
  PolicyItem,
  ResearchPaper,
  EconomicConnection,
  EconomicIndicator,
  SourceConfig
} from '../../types/index.ts';

export const initialSources: SourceConfig[] = [
  {
    id: 'fed-press-releases',
    name: 'Federal Reserve Board - Press Releases & Speeches',
    institution: 'Federal Reserve System',
    type: 'rss',
    url: 'https://www.federalreserve.gov/feeds/press_all.xml',
    jurisdiction: 'United States',
    category: 'Monetary Policy',
    active: true,
    lastChecked: '2026-11-09T18:00:00Z',
    itemCount: 24
  },
  {
    id: 'ecb-press',
    name: 'ECB Press Releases & Monetary Policy Decisions',
    institution: 'European Central Bank',
    type: 'rss',
    url: 'https://www.ecb.europa.eu/rss/press.html',
    jurisdiction: 'Eurozone',
    category: 'Monetary Policy',
    active: true,
    lastChecked: '2026-11-09T18:10:00Z',
    itemCount: 18
  },
  {
    id: 'bis-research',
    name: 'Bank for International Settlements - Papers & Speeches',
    institution: 'Bank for International Settlements',
    type: 'rss',
    url: 'https://www.bis.org/doclist/rss/press_releases.rss',
    jurisdiction: 'Global',
    category: 'Banking & Financial Stability',
    active: true,
    lastChecked: '2026-11-09T18:15:00Z',
    itemCount: 15
  },
  {
    id: 'imf-news',
    name: 'IMF Research & Executive Board Decisions',
    institution: 'International Monetary Fund',
    type: 'rss',
    url: 'https://www.imf.org/en/News/Rss?category=Press%20Releases',
    jurisdiction: 'Global',
    category: 'International Finance',
    active: true,
    lastChecked: '2026-11-09T18:20:00Z',
    itemCount: 12
  },
  {
    id: 'oecd-economic-outlook',
    name: 'OECD Economic Forecasts & Structural Policy Reviews',
    institution: 'OECD',
    type: 'rss',
    url: 'https://www.oecd.org/economy/rss.xml',
    jurisdiction: 'Global',
    category: 'Macroeconomics',
    active: true,
    lastChecked: '2026-11-09T18:25:00Z',
    itemCount: 10
  },
  {
    id: 'nber-working-papers',
    name: 'National Bureau of Economic Research (NBER) Working Papers',
    institution: 'NBER',
    type: 'rss',
    url: 'https://www.nber.org/rss/new.xml',
    jurisdiction: 'United States',
    category: 'Academic Research',
    active: true,
    lastChecked: '2026-11-09T18:30:00Z',
    itemCount: 30
  },
  {
    id: 'cepr-discussion-papers',
    name: 'Centre for Economic Policy Research (CEPR) Policy Insights',
    institution: 'CEPR',
    type: 'rss',
    url: 'https://cepr.org/voxeu/rss',
    jurisdiction: 'Europe',
    category: 'Academic Research',
    active: true,
    lastChecked: '2026-11-09T18:35:00Z',
    itemCount: 22
  },
  {
    id: 'bls-cpi-releases',
    name: 'Bureau of Labor Statistics - CPI & Employment Situation',
    institution: 'Bureau of Labor Statistics',
    type: 'rss',
    url: 'https://www.bls.gov/feed/cpi.rss',
    jurisdiction: 'United States',
    category: 'Macro Data',
    active: true,
    lastChecked: '2026-11-09T18:40:00Z',
    itemCount: 14
  },
  {
    id: 'pboc-monetary-policy',
    name: 'People\'s Bank of China - Monetary Policy Announcements',
    institution: 'People\'s Bank of China',
    type: 'api',
    url: 'http://www.pbc.gov.cn/zhengcehuobisi/125207/index.html',
    jurisdiction: 'China',
    category: 'Monetary Policy & Credit Allocation',
    active: true,
    lastChecked: '2026-11-09T18:45:00Z',
    itemCount: 8
  },
  {
    id: 'bea-gdp-accounts',
    name: 'Bureau of Economic Analysis - National Income & Product Accounts',
    institution: 'Bureau of Economic Analysis',
    type: 'rss',
    url: 'https://apps.bea.gov/rss/rss.xml',
    jurisdiction: 'United States',
    category: 'Macro Data',
    active: true,
    lastChecked: '2026-11-09T18:50:00Z',
    itemCount: 9
  }
];

export const initialStories: EconomicStory[] = [
  {
    id: 'story-fed-qt-calibration-2026',
    headline: 'Federal Reserve Moderates Balance Sheet Runoff Pace as Money Market Frictions Emerge',
    originalSource: 'Federal Reserve Board Press Release & Statement on Balance Sheet Normalization',
    sourceUrl: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20261104a.htm',
    publicationDate: '2026-11-05',
    eventDate: '2026-11-04',
    jurisdiction: 'United States',
    institutions: ['Federal Reserve', 'Federal Open Market Committee (FOMC)', 'Federal Reserve Bank of New York Open Market Desk'],
    factualSummary: 'The FOMC lowered the monthly redemption redemption cap on Treasury securities from $60 billion to $25 billion while maintaining the agency debt and agency mortgage-backed securities cap at $35 billion. The Standing Repo Facility (SRF) recorded minimum utilization, but overnight reverse repurchase agreement (ON RRP) facility balances settled under $120 billion, triggering staff recommendations to guard against cross-market liquidity strains.',
    classification: ['Macroeconomics', 'Monetary economics', 'Banking and financial regulation'],
    mechanisms: ['Monetary transmission', 'Credit transmission', 'Expectations and uncertainty', 'Capital allocation'],
    theoreticalFrameworks: [
      'Ample Reserves Operating Framework (Keister & McAndrews, 2009)',
      'Preferred Habitat Theory of the Term Structure (Vayanos & Vila, 2021)',
      'Interbank Liquidity Hoarding Models (Acharya, Shin & Yorulmazer, 2011)'
    ],
    economicMechanismsDetail: 'By reducing the quantitative tightening (QT) runoff rate, the central bank preserves structural bank reserves inside the Federal Reserve system. As ON RRP buffers deplete, bank deposits and reserve balances become sensitive to Treasury General Account (TGA) cash fluctuations. Moderating the roll-off stabilizes the SOFR-IORB spread, averting a repeat of the September 2019 repo spike without signaling an impending easing of the benchmark federal funds rate target.',
    possibleImplications: {
      nearTerm: [
        'Mitigates upward pressure on repo rates and Secured Overnight Financing Rate (SOFR) spikes around month-end settlement dates.',
        'Reduces the volume of Treasury bill supply that the private dealer network must absorb at duration discounts.'
      ],
      structural: [
        'Prolongs the ultimate size of the Federal Reserve balance sheet relative to nominal GDP (stabilizing around 18-20% of GDP).',
        'Establishes a higher structural floor for the Lowest Comfortable Level of Reserves (LCLOR) across the US banking sector.'
      ]
    },
    distributionalEffects: 'Primary dealer balance sheets benefit from reduced inventory financing burdens; non-bank institutional lenders in repo markets face slight yield compression on overnight cash collateralization.',
    uncertaintyAndAlternatives: 'Staff estimates of the banking system\'s aggregate lowest comfortable level of reserves remain imprecise. If commercial bank reserve demand is steeper than modeled due to Basel III liquidity coverage ratios (LCR), intraday liquidity strains may still surface prior to 2027.',
    academicResearchCitations: [
      {
        paperTitle: 'Liquidity, Leverage, and the Federal Reserve\'s Balance Sheet',
        authors: 'Tobias Adrian and Hyun Song Shin',
        year: 2021,
        sourceOrJournal: 'Journal of Economic Perspectives',
        keyFinding: 'Dealer balance sheet capacity is non-linear in volatility; contraction in Fed reserves disproportionately impacts non-bank funding spreads.'
      },
      {
        paperTitle: 'Steering the Federal Reserve\'s Balance Sheet: Lessons from September 2019',
        authors: 'Gara Afonso, Marco Cipriani, and Gabriele La Spada',
        year: 2023,
        sourceOrJournal: 'Economic Policy Review',
        keyFinding: 'Reserve dispersion across depository institutions is highly skewed, making aggregate reserve metrics misleading when measuring money market stress.'
      }
    ],
    potentialResearchQuestions: [
      'How does the elasticity of repo rates to net Treasury bill issuance shift when central bank reserve balances approach 8% of commercial bank assets?',
      'Does QT taper alter the term premium independently of forward guidance regarding the policy rate?'
    ],
    futureIndicatorsToWatch: [
      'SOFR minus Interest on Reserve Balances (IORB) spread (bps)',
      'Tri-Party Repo volumes and FICC Sponsored Service clearing rates',
      'Treasury General Account (TGA) weekly balance variance'
    ],
    significanceScore: 94,
    relatedStoryIds: ['story-ecb-balance-sheet-2026', 'story-bis-fx-swap-liquidity-2026'],
    status: 'analyzed'
  },
  {
    id: 'story-ecb-balance-sheet-2026',
    headline: 'European Central Bank Deploys Structural Refinancing Facility to Anchor Euribor Stability',
    originalSource: 'ECB Press Release - Operational Framework for Implementing Monetary Policy',
    sourceUrl: 'https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp20261029.en.html',
    publicationDate: '2026-11-06',
    eventDate: '2026-11-05',
    jurisdiction: 'Eurozone',
    institutions: ['European Central Bank', 'Eurosystem', 'Single Supervisory Mechanism'],
    factualSummary: 'The ECB Governing Council formalized the parameters of its new longer-term structural refinancing operations (SROs) and a structural portfolio of securities, narrowing the spread between the Main Refinancing Operations (MRO) rate and the Deposit Facility Rate (DFR) to 15 basis points. Full allotment against collateral was confirmed for short-term liquidity injections.',
    classification: ['Monetary economics', 'Banking and financial regulation', 'International finance'],
    mechanisms: ['Monetary transmission', 'Credit transmission', 'Price mechanisms', 'Information asymmetry'],
    theoreticalFrameworks: [
      'Bagehot\'s Dictum on Central Banking Liquidity Provision',
      'Corridor vs. Floor Monetary Operating Systems (Bindseil, 2016)',
      'Sovereign-Bank Nexus in Fragmented Currency Unions (Brunnermeier et al., 2016)'
    ],
    economicMechanismsDetail: 'By tightening the corridor between the lending facility and deposit rate, the ECB reduces rate volatility as excess liquidity drains across the Eurosystem. The structural operations prevent uneven liquidity distribution among peripheral and core banks from creating artificial spread widening in unsecured interbank lending markets (€STR and Euribor).',
    possibleImplications: {
      nearTerm: [
        'Constrains fragmentation risks in Spanish and Italian interbank borrowing costs.',
        'Standardizes bank collateral eligibility criteria under updated green and sustainability hair-cuts.'
      ],
      structural: [
        'Transitions the Eurosystem to a hybrid demand-driven floor system.',
        'Reduces moral hazard by charging a market-linked benchmark rather than subsidized negative-rate refinancing (TLTRO-style).'
      ]
    },
    distributionalEffects: 'Peripheral European banks with lower reliance on wholesale commercial paper gain more stable access to central liquidity; core northern European banks experience slightly lower surplus reserve deposit arbitrage yields.',
    uncertaintyAndAlternatives: 'Critics argue that high structural reliance on ECB liquidity facilities may disincentivize private cross-border interbank integration across the European Banking Union.',
    academicResearchCitations: [
      {
        paperTitle: 'Evaluating Central Bank Asset Purchase and Operational Frameworks in the Euro Area',
        authors: 'Ulrich Bindseil and Philip R. Lane',
        year: 2024,
        sourceOrJournal: 'ECB Working Paper Series',
        keyFinding: 'A narrow-spread corridor stabilizes short-term market rates with significantly less aggregate balance sheet expansion than a permanent floor system.'
      }
    ],
    potentialResearchQuestions: [
      'Does a permanent structural bond portfolio in the Eurozone distort sovereign yield curve price discovery during periods of asymmetric fiscal shocks?'
    ],
    futureIndicatorsToWatch: [
      '€STR volumes and rate dispersion percentile',
      'Eurozone target balances (Target3 net claims)',
      '10-year BTP-Bund and Bonos-Bund sovereign spreads'
    ],
    significanceScore: 89,
    relatedStoryIds: ['story-fed-qt-calibration-2026', 'story-policy-tpi-monitoring'],
    status: 'analyzed'
  },
  {
    id: 'story-bis-fx-swap-liquidity-2026',
    headline: 'BIS Warns of Off-Balance-Sheet FX Swap Vulnerabilities in Global Non-Bank Financial Intermediation',
    originalSource: 'Bank for International Settlements Quarterly Review Bulletin',
    sourceUrl: 'https://www.bis.org/publ/qtrpdf/r_qt2611a.htm',
    publicationDate: '2026-11-07',
    eventDate: '2026-11-06',
    jurisdiction: 'Global',
    institutions: ['Bank for International Settlements', 'Financial Stability Board (FSB)', 'G10 Central Bank Governors'],
    factualSummary: 'The BIS released empirical estimates indicating that off-balance-sheet US dollar debt embedded in FX swaps, forwards, and currency swaps held by non-US financial institutions has exceeded $85 trillion. The review highlighted that pension funds and life insurers running cross-currency duration mismatches rely heavily on short-tenor roll-over contracts with major dealer banks.',
    classification: ['International finance', 'Financial economics', 'Banking and financial regulation'],
    mechanisms: ['International capital flows', 'Information asymmetry', 'Credit transmission', 'Expectations and uncertainty'],
    theoreticalFrameworks: [
      'Covered Interest Parity (CIP) Deviations and the Dollar Funding Premium (Du, Tepper & Verdelhan, 2018)',
      'Global Financial Cycle and Central Bank Swap Lines (Rey, 2015; Obstfeld et al., 2019)',
      'Liquidity Spiral and Fire-Sale Externality (Brunnermeier & Pedersen, 2009)'
    ],
    economicMechanismsDetail: 'FX swaps create functional debt obligations identical to collateralized dollar borrowing, yet are excluded from standard balance sheet leverage and accounting debt tallies. When global risk appetite drops, US dealers ration their balance sheet space to preserve supplementary leverage ratio (SLR) buffers. Non-US institutions facing roll-overs are forced to bid up the dollar, widening cross-currency basis spreads and propagating financial stress internationally.',
    possibleImplications: {
      nearTerm: [
        'Heightened sensitivity of non-US institutional portfolios to sudden Federal Reserve liquidity shifts or USD appreciation shocks.',
        'Regulatory scrutiny on synthetic leverage reporting under FSB and IOSCO macroprudential frameworks.'
      ],
      structural: [
        'Persistent pressure for permanent multilateral central bank FX swap arrangements beyond the current bilateral standing network.',
        'Potential disincentives for institutional asset managers to hedge foreign exchange risk on international real asset investments.'
      ]
    },
    distributionalEffects: 'Large global custody and investment banks capture basis premia during volatility; non-bank institutional asset owners (pension funds, sovereign wealth funds) bear higher hedging costs.',
    uncertaintyAndAlternatives: 'Industry representatives contend that because FX swaps are backed by opposing currency collateral, the actual credit loss probability is negligible relative to uncollateralized syndicated loans.',
    academicResearchCitations: [
      {
        paperTitle: 'Deviations from Covered Interest Parity and Balance Sheet Constraints',
        authors: 'Wenxin Du, Alexander Tepper, and Adrien Verdelhan',
        year: 2018,
        sourceOrJournal: 'The Journal of Finance',
        keyFinding: 'Post-crisis regulatory leverage constraints broke CIP arbitrage, turning the currency basis into a persistent price on intermediary balance sheet capacity.'
      }
    ],
    potentialResearchQuestions: [
      'To what extent do central bank currency swap lines mitigate systemic run risks among non-bank institutional participants lacking direct discount window access?'
    ],
    futureIndicatorsToWatch: [
      '3-month EUR/USD and JPY/USD cross-currency basis swap spreads (bps)',
      'Dealer CDS indices and Bank Commercial Paper issuance tenors',
      'Non-US bank holdings of US Treasury securities'
    ],
    significanceScore: 92,
    relatedStoryIds: ['story-fed-qt-calibration-2026', 'story-china-pboc-liquidity-2026'],
    status: 'analyzed'
  },
  {
    id: 'story-china-pboc-liquidity-2026',
    headline: 'PBOC Cuts Reserve Requirement Ratio (RRR) and Launches Targeted Refinancing for Advanced Tech',
    originalSource: 'People\'s Bank of China Executive Release & State Council Communiqué',
    sourceUrl: 'http://www.pbc.gov.cn/goutongjiaoliu/113456/113469/index.html',
    publicationDate: '2026-11-08',
    eventDate: '2026-11-07',
    jurisdiction: 'China',
    institutions: ['People\'s Bank of China', 'National Financial Regulatory Administration (NFRA)', 'State Council of China'],
    factualSummary: 'The PBOC announced a 50-basis-point reduction in the statutory reserve requirement ratio for all commercial banks (excluding rural banks already at 5%), releasing approximately 1 trillion yuan in long-term liquidity. Concurrently, a special 500-billion-yuan low-interest relending facility was deployed to finance research and equipment upgrades in high-end manufacturing and semiconductors.',
    classification: ['Macroeconomics', 'Monetary economics', 'Development economics', 'Industrial organisation'],
    mechanisms: ['Credit transmission', 'Capital allocation', 'Price mechanisms', 'Institutional change'],
    theoreticalFrameworks: [
      'Credit Guidance and Directed Lending Models (Stiglitz & Weiss, 1981)',
      'Structural Monetary Policy Frameworks in Dual-Track Economies',
      'Balance Sheet Recession and Debt-Deflation Pressures (Koo, 2011; Bernanke & Gertler, 1989)'
    ],
    economicMechanismsDetail: 'The broad-based RRR cut lowers commercial banks\' funding costs by eliminating mandatory low-yielding statutory reserves. However, rather than relying exclusively on aggregate interest rate cuts which risk exacerbating capital outflows and yuan depreciation pressures, the central bank couples the liquidity release with earmarked quota lending. This targets credit creation toward capital-intensive manufacturing while containing speculative flows into overbuilt real estate sectors.',
    possibleImplications: {
      nearTerm: [
        'Boosts net interest margin (NIM) cushions for Chinese state-owned commercial banks by replacing high-cost MLF loans.',
        'Moderates downside drag from property developer credit restructuring.'
      ],
      structural: [
        'Deepens state-directed credit allocation away from municipal real-estate urbanization toward high-tech industrial self-reliance.',
        'Increases aggregate private corporate debt ratios while keeping consumer price inflation subdued.'
      ]
    },
    distributionalEffects: 'High-tech manufacturing enterprises and sovereign state contractors receive priority credit lines below 2.0% annual financing; private households face low deposit rates with limited consumption multiplier spillover.',
    uncertaintyAndAlternatives: 'If private corporate and household loan demand remains structurally sluggish due to pessimistic income expectations, the liquidity injection may pool within the interbank money market without translating into real economic velocity.',
    academicResearchCitations: [
      {
        paperTitle: 'The Political Economy of Directed Credit in China',
        authors: 'Chong-En Bai, Chang-Tai Hsieh, and Zheng Michael Song',
        year: 2020,
        sourceOrJournal: 'Brookings Papers on Economic Activity',
        keyFinding: 'Structural credit quotas channel resources into policy-favored industries, creating localized productivity surges alongside capital misallocation in non-favored sectors.'
      }
    ],
    potentialResearchQuestions: [
      'What are the dynamic deadweight losses of targeted monetary refinancing compared to fiscal wage subsidies when facing aggregate demand deficits?'
    ],
    futureIndicatorsToWatch: [
      'Aggregate Financing to the Real Economy (AFRE) monthly growth rate',
      'USD/CNY onshore and offshore spot rates',
      'China Core CPI and Producer Price Index (PPI) year-over-year'
    ],
    significanceScore: 88,
    relatedStoryIds: ['story-bis-fx-swap-liquidity-2026'],
    status: 'analyzed'
  },
  {
    id: 'story-imf-weo-fragmentation-2026',
    headline: 'IMF Flags Global Trade Fragmentation Costs: Multilateral Trade Barriers Threaten 2.8% Output Loss',
    originalSource: 'International Monetary Fund - World Economic Outlook Analytical Chapters',
    sourceUrl: 'https://www.imf.org/en/Publications/WEO/Issues/2026/10/weo-analytical-chapters',
    publicationDate: '2026-11-08',
    eventDate: '2026-11-07',
    jurisdiction: 'Global',
    institutions: ['International Monetary Fund', 'World Trade Organization', 'OECD'],
    factualSummary: 'The IMF presented an updated multi-country general equilibrium simulation estimating that escalating bilateral tariff measures, export controls on critical minerals, and retaliatory industrial policies could reduce global output by up to 2.8% in the medium term. Emerging market economies with high external debt and concentrated export baskets face the sharpest terms-of-trade degradation.',
    classification: ['International economics', 'International finance', 'Public economics'],
    mechanisms: ['Market power', 'Strategic interaction', 'Price mechanisms', 'Welfare and distribution'],
    theoreticalFrameworks: [
      'Ricardian Comparative Advantage and Gains from Trade (Costinot & Rodríguez-Clare, 2014)',
      'Tariff War Game Theory and Nash Equilibria (Grossman & Helpman, 1994)',
      'Global Value Chain (GVC) Multi-Stage Production Disruption (Antràs & Chor, 2021)'
    ],
    economicMechanismsDetail: 'Import duties and localized sourcing quotas force firms to substitute efficient international suppliers with higher-cost domestic or nearshore alternatives. Input price inflation accumulates along vertical supply chains. Concurrently, sovereign tit-for-tat retaliations destroy export market scale economies, reducing capital accumulation rates and retarding total factor productivity (TFP) growth across both developing and developed blocs.',
    possibleImplications: {
      nearTerm: [
        'Persistent cost-push inflationary pressure on imported manufactured intermediates and electronics.',
        'Heightened currency volatility among intermediate transshipment hubs (e.g. Mexico, Vietnam, Poland).'
      ],
      structural: [
        'Bifurcation of global technology standards and supply chain ecosystems.',
        'Weakened compliance with WTO multilateral dispute settlement rulings, shifting world trade to bilateral power negotiations.'
      ]
    },
    distributionalEffects: 'Domestic import-competing capital owners in subsidized industries gain rents; consumer purchasing power declines, disproportionately harming lower-income households whose consumption baskets have high tradable goods content.',
    uncertaintyAndAlternatives: 'Proponents of strategic trade policy argue that models fail to value supply-chain resilience against non-economic geopolitical disruptions, suggesting that national security benefits offset the simulated efficiency losses.',
    academicResearchCitations: [
      {
        paperTitle: 'Global Supply Chains in a Fragmented World',
        authors: 'Pol Antràs and Laura Alfaro',
        year: 2024,
        sourceOrJournal: 'Review of Economic Studies',
        keyFinding: 'Nearshoring alters trade routes through third-party connector countries rather than completely decoupling major economic blocs, adding intermediary markups.'
      }
    ],
    potentialResearchQuestions: [
      'How does geoeconomic fragmentation impact sovereign borrowing premia in small open economies reliant on commodity exports?'
    ],
    futureIndicatorsToWatch: [
      'Global Trade Uncertainty Index (WTUI)',
      'Baltic Dry Index and Shanghai Containerized Freight Index',
      'Emerging Market Bond Index (EMBI) sovereign yield spreads'
    ],
    significanceScore: 90,
    relatedStoryIds: ['story-china-pboc-liquidity-2026', 'story-nber-paper-tariffs'],
    status: 'analyzed'
  }
];

export const initialBriefings: DailyBriefing[] = [
  {
    id: 'briefing-2026-11-09',
    editionDate: '2026-11-09',
    generatedAt: '2026-11-09T20:00:00Z',
    lastUpdateStatus: 'success',
    executiveSummary: 'Global central banking enters a delicate phase of operational normalization against a backdrop of emerging money market liquidity frictions and deepening trade fragmentation. The Federal Reserve\'s decision to taper the pace of quantitative tightening marks a deliberate effort to defend money market stability as reverse repo buffers near exhaustion. Concurrently, the European Central Bank\'s new structural refinancing framework seeks to prevent peripheral fragmentation without returning to subsidized crisis loans. In Asia, the People\'s Bank of China combines aggregate RRR cuts with directed industrial refinancing, highlighting the divergent policy responses across major economic jurisdictions.',
    leadStoryId: 'story-fed-qt-calibration-2026',
    topStoryIds: [
      'story-fed-qt-calibration-2026',
      'story-bis-fx-swap-liquidity-2026',
      'story-ecb-balance-sheet-2026',
      'story-imf-weo-fragmentation-2026',
      'story-china-pboc-liquidity-2026'
    ],
    environmentOverview: {
      monetaryStance: 'Cautiously restrictive across developed markets; gradual calibration of balance sheet runoffs to prevent funding market flashpoints while maintaining terminal rates above neutral (r*).',
      fiscalOutlook: 'Mounting sovereign debt service burdens in the US and Eurozone constrain countercyclical fiscal space; reliance shifts back toward monetary and targeted credit instruments.',
      financialStabilityAlerts: 'Elevated off-balance-sheet FX swap rolls ($85T) and non-bank financial intermediary (NBFI) leverage warrant active surveillance as bank reserves concentrate.',
      crossBorderRisks: 'Geoeconomic trade fragmentation and targeted export tariffs generate localized input price wedges, reducing real global GDP potential by an estimated 2.8%.'
    },
    regionalSummary: {
      'United States': 'Fed slows Treasury runoff to $25B/mo; labor market cooling to trend while headline CPI stabilizes near 2.6%. Treasury curve un-inverts as term premia re-anchor.',
      'Eurozone': 'ECB narrows MRO-DFR corridor to 15 bps to preempt interbank rate dispersion; sovereign spreads remain stable under vigilant TPI readiness.',
      'China & East Asia': 'PBOC releases 1T yuan via 50 bps RRR cut, deploying 500B yuan targeted facility for high-tech capital upgrades; property sector debt resolution remains gradual.',
      'Global & Multilateral': 'BIS and IMF highlight cross-border vulnerabilities in dollar swap lines and supply chain reconfiguration markups.'
    },
    indicatorHighlights: [
      { label: 'US Fed Funds Target Upper Bound', value: '4.50%', change: '-25 bps', signal: 'dovish' },
      { label: 'ECB Deposit Facility Rate', value: '3.25%', change: '-25 bps', signal: 'dovish' },
      { label: 'US 10Y-2Y Treasury Yield Spread', value: '+18 bps', change: '+6 bps', signal: 'expansionary' },
      { label: 'US Core CPI YoY (Latest)', value: '2.8%', change: '-0.1%', signal: 'neutral' },
      { label: 'USD/EUR Cross-Currency Basis (3M)', value: '-12 bps', change: '-3 bps', signal: 'contractionary' }
    ],
    sourcesQueriedCount: 10,
    articlesIngestedCount: 42
  }
];

export const initialPolicies: PolicyItem[] = [
  {
    id: 'policy-fed-balance-sheet-2026',
    jurisdiction: 'United States',
    institution: 'Federal Reserve / FOMC',
    title: 'Policy on Balance Sheet Normalization and QT Tapering Schedule',
    announcementDate: '2026-11-04',
    consultationDate: '2026-09-18',
    adoptionDate: '2026-11-04',
    effectiveDate: '2026-12-01',
    status: 'Enacted',
    previousPolicyVersion: 'Principles for Reducing the Size of the Federal Reserve\'s Balance Sheet (May 2022)',
    targetedEconomicProblem: 'Emergence of collateral frictions and volatility in overnight unsecured/secured interbank funding rates as ON RRP balances decline.',
    expectedTransmissionMechanisms: [
      'Reduces the monthly drain of commercial bank deposits at the central bank.',
      'Maintains reserves above the Lowest Comfortable Level of Reserves (LCLOR).',
      'Lessens primary dealer capacity constraints in underwriting Treasury issuance.'
    ],
    winners: ['Primary dealers', 'Money market funds', 'Regional banks with tighter liquidity ratios'],
    losers: ['Investors seeking high duration concession premia on primary Treasury auctions'],
    unintendedConsequences: ['Market misinterpretation as premature monetary easing, potentially loosen financial conditions counter to the 2% inflation target.'],
    relatedStoryIds: ['story-fed-qt-calibration-2026'],
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/bst_openmarketops.htm'
  },
  {
    id: 'policy-tpi-monitoring',
    jurisdiction: 'Eurozone',
    institution: 'European Central Bank',
    title: 'Transmission Protection Instrument (TPI) & Operational Corridor Framework',
    announcementDate: '2026-10-29',
    adoptionDate: '2026-10-29',
    effectiveDate: '2026-11-15',
    status: 'Implemented',
    previousPolicyVersion: 'ECB Operational Framework Review (March 2024)',
    targetedEconomicProblem: 'Disorderly or unwarranted sovereign spread widening across member states that impairs the uniform transmission of monetary policy.',
    expectedTransmissionMechanisms: [
      'Ex-ante deterrent against speculative shorting of peripheral sovereign debt (Italy, Spain, Greece).',
      'Narrowed MRO-DFR corridor reduces price dispersion in secured and unsecured money markets.'
    ],
    winners: ['Peripheral Eurozone sovereign treasuries', 'Euro area retail borrowers facing cross-border loan rates'],
    losers: ['Hedge funds engaged in sovereign basis convergence trades'],
    unintendedConsequences: ['Moral hazard regarding compliance with the EU Stability and Growth Pact fiscal deficit rules.'],
    relatedStoryIds: ['story-ecb-balance-sheet-2026'],
    sourceUrl: 'https://www.ecb.europa.eu/press/pr/date/2022/html/ecb.pr220721~971517170e.en.html'
  },
  {
    id: 'policy-pboc-targeted-relending',
    jurisdiction: 'China',
    institution: 'People\'s Bank of China & NFRA',
    title: 'Strategic Technological Innovation and Equipment Modernization Refinancing Program',
    announcementDate: '2026-11-07',
    effectiveDate: '2026-11-15',
    status: 'Enacted',
    targetedEconomicProblem: 'Sluggish private corporate capital expenditures and industrial supply chain vulnerabilities in semiconductor fabrication and robotics.',
    expectedTransmissionMechanisms: [
      'PBOC extends low-cost (1.75%) credit lines to designated commercial banks specifically tied to validated corporate Capex contracts.',
      'Reduces borrowing hurdle rates for high-tech manufacturing.'
    ],
    winners: ['Advanced equipment manufacturers', 'Commercial state banks securing risk-cushioned credit volume'],
    losers: ['Traditional residential property developers and non-strategic heavy manufacturing'],
    unintendedConsequences: ['Potential industrial overcapacity in prioritized sub-sectors if domestic consumer absorption capacity lags.'],
    relatedStoryIds: ['story-china-pboc-liquidity-2026'],
    sourceUrl: 'http://www.pbc.gov.cn/zhengcehuobisi/125207/index.html'
  }
];

export const initialResearch: ResearchPaper[] = [
  {
    id: 'research-nber-mortgage-passthrough',
    title: 'Monetary Policy Pass-Through in a Fixed-Rate Mortgage Regime: The Lock-In Channel and Labor Mobility',
    authors: ['Gabriel Chodorow-Reich', 'Plamen Nenov', 'Johannes Wieland'],
    institution: 'NBER',
    publicationDate: '2026-10-28',
    format: 'Working Paper',
    field: 'Monetary economics / Housing Economics',
    isAbstractOnly: false,
    researchQuestion: 'How does the prevalence of long-tenor fixed-rate mortgages alter the macroeconomic transmission of central bank rate hikes to consumer expenditure and regional labor reallocation?',
    methodology: 'Empirical estimation using micro-level credit bureau records and county-level deed registries combined with a heterogeneous-agent New Keynesian (HANK) model incorporating mortgage refinancing options and geographic moving frictions.',
    mainFindings: [
      'The "mortgage lock-in effect" reduced interstate residential moving rates by 18% among households with mortgage interest rates 300 bps below prevailing origination rates.',
      'Aggregate consumer spending contracted through reduced housing transaction turnover (furnishings, renovations, brokerage fees) rather than direct debt-service cash flow cuts.',
      'Labor misallocation generated a persistent 0.25 percentage point drag on aggregate labor productivity in dynamic metro areas.'
    ],
    contribution: 'Provides quantitative identification of the housing lock-in channel as an asymmetric structural drag on labor supply responsiveness during monetary tightening cycles.',
    limitations: [
      'Relies primarily on US municipal deed registries; findings may not generalize directly to European jurisdictions with adjustable-rate or portable mortgage contracts.',
      'Long-term general equilibrium wage adjustments in receiving metro areas are estimated with standard error bounds.'
    ],
    relatedPreviousResearch: [
      'Berger, Milbradt, Tourre & Vavra (2021) "Mortgage Prepayment and Path-Dependent Monetary Policy"',
      'Mian, Rao & Sufi (2013) "Household Balance Sheets, Consumption, and the Economic Slump"'
    ],
    paperUrl: 'https://www.nber.org/papers/w33120'
  },
  {
    id: 'research-cepr-tariffs-markups',
    title: 'Tariff Incidence in Vertically Integrated Production Networks: Who Bears the Cost of Strategic Trade Realignment?',
    authors: ['Dalia Marin', 'Jan De Loecker', 'Kalina Manova'],
    institution: 'CEPR',
    publicationDate: '2026-11-02',
    format: 'Policy Discussion Paper',
    field: 'International economics / Industrial Organisation',
    isAbstractOnly: false,
    researchQuestion: 'What fraction of statutory import duties on industrial intermediate goods is absorbed by foreign exporting markups versus passed onto domestic downstream producer prices?',
    methodology: 'High-frequency customs transaction dataset spanning 2021-2026 across European and North American industrial machinery imports, merged with firm balance sheet markup estimations via production function approaches.',
    mainFindings: [
      'Complete pass-through (near 100%) of tariffs into dockside import prices in intermediate manufacturing, indicating zero terms-of-trade improvement for the tariff-imposing jurisdiction.',
      'Domestic downstream manufacturing firms suffered a 4.2% margin compression on average due to intermediate input stickiness before substituting suppliers.',
      'Transshipment routing through intermediary non-aligned jurisdictions added an average 6.8% logistics and compliance overhead markup.'
    ],
    contribution: 'Demonstrates empirically that intermediate input tariffs act as an immediate supply-side cost shock rather than a strategic rent-extraction tool.',
    limitations: [
      'Excludes non-tariff regulatory barriers such as carbon border adjustment mechanisms (CBAM).',
      'Analysis is abstract-based for confidential proprietary Japanese automotive supply sub-components.'
    ],
    relatedPreviousResearch: [
      'Amiti, Redding & Weinstein (2019) "The Impact of the 2018 Tariffs on Prices and Welfare"',
      'Fajgelbaum, Goldberg, Kennedy & Khandelwal (2020) "The Return to Protectionism"'
    ],
    paperUrl: 'https://cepr.org/voxeu/columns/tariff-incidence-vertical-supply-chains'
  },
  {
    id: 'research-bis-shadow-banking',
    title: 'The Inherent Fragility of Non-Bank Liquidity Transformation: Run Dynamics in Private Credit Funds',
    authors: ['Claudio Borio', 'Inaki Aldasoro', 'Torsten Ehlers'],
    institution: 'BIS',
    publicationDate: '2026-10-15',
    format: 'Working Paper',
    field: 'Financial economics / Banking and financial regulation',
    isAbstractOnly: true,
    researchQuestion: 'Do redemption gates and subscription-line bank credit facilities effectively insulate semi-liquid private debt funds from classic run dynamics during credit tightening?',
    methodology: 'Abstract-based analytical model of collective action frictions calibrated against regulatory disclosures and syndicated loan default data during 2022-2026 interest rate shifts.',
    mainFindings: [
      'Redemption gates mitigate immediate cash outflows but incentivize first-mover requests during early stress signals.',
      'Subscription-line borrowing by private funds creates a contagion link back into regulated tier-1 commercial banking balance sheets.',
      'Valuation lags on opaque direct loans mask economic impairments until liquidity shocks force secondary portfolio sales.'
    ],
    contribution: 'Identifies the structural interconnections between private credit asset managers and global systemically important banks (G-SIBs).',
    limitations: [
      'Analysis is abstract-based due to limited public transaction pricing in bilateral private credit agreements.',
      'Sample reflects predominantly upper-middle market corporate borrowers.'
    ],
    relatedPreviousResearch: [
      'Diamond & Dybvig (1983) "Bank Runs, Deposit Insurance, and Liquidity"',
      'Plantin (2015) "Shadow Banking and Bank Capital Regulation"'
    ],
    paperUrl: 'https://www.bis.org/publ/work1180.htm'
  }
];

export const initialConnections: EconomicConnection[] = [
  {
    id: 'conn-qt-repo19',
    sourceId: 'story-fed-qt-calibration-2026',
    targetId: 'story-ecb-balance-sheet-2026',
    sourceTitle: 'Fed Moderates Balance Sheet Runoff Pace',
    targetTitle: 'ECB Deploys Structural Refinancing Facility',
    type: 'continuation',
    rationale: 'Both actions represent coordinated central bank operational shifts transitioning from emergency crisis balance sheets to long-term steady-state liquidity operating regimes without provoking interbank rate spikes.',
    confidence: 'established'
  },
  {
    id: 'conn-qt-history-19',
    sourceId: 'story-fed-qt-calibration-2026',
    targetId: 'hist-repo-spike-2019',
    sourceTitle: 'Fed Moderates Balance Sheet Runoff Pace',
    targetTitle: 'September 2019 Repo Market Liquidity Spike',
    type: 'historical analogy',
    rationale: 'In September 2019, excessive reserve drainage coupled with corporate tax deadlines and Treasury auction settlements drove SOFR from 2.4% to nearly 10% overnight. The 2026 QT taper explicitly seeks to prevent this structural vulnerability.',
    historicalPrecedent: {
      era: 'September 2019',
      description: 'The Fed allowed reserve balances to fall below $1.4 trillion while Treasury issuance surged, exhausting primary dealer cash balances and forcing sudden emergency term repo operations.',
      keySimilarity: 'Depletion of cash in the overnight reverse repo facility leaves bank reserves as the sole buffer against Treasury cash drawdowns.',
      keyDifference: 'The Standing Repo Facility (SRF) is now an active permanent backstop, providing an automatic ceiling to intraday repo spikes.'
    },
    confidence: 'analogous'
  },
  {
    id: 'conn-fx-swap-gfc',
    sourceId: 'story-bis-fx-swap-liquidity-2026',
    targetId: 'hist-swap-lines-2008',
    sourceTitle: 'BIS Warns of Off-Balance-Sheet FX Swap Vulnerabilities',
    targetTitle: '2008 Global Financial Crisis Dollar Funding Freeze',
    type: 'theoretical connection',
    rationale: 'Demonstrates Covered Interest Parity (CIP) breakdown as dealer bank balance sheet capacity binds, requiring central bank swap line intervention to prevent cross-currency fire sales.',
    historicalPrecedent: {
      era: 'Autumn 2008 & March 2020',
      description: 'Foreign commercial banks could not roll over short-term USD commercial paper and FX swap commitments, forcing the Federal Reserve to establish emergency liquidity swap lines with 14 foreign central banks.',
      keySimilarity: 'Global reliance on short-term rolling dollar liabilities by institutions outside the direct jurisdiction of the Federal Reserve.',
      keyDifference: 'Current vulnerability is concentrated in non-bank financial intermediaries (pension funds and private debt) rather than traditional European commercial banks.'
    },
    confidence: 'established'
  },
  {
    id: 'conn-tariffs-fragmentation',
    sourceId: 'story-imf-weo-fragmentation-2026',
    targetId: 'research-cepr-tariffs-markups',
    sourceTitle: 'IMF Flags Global Trade Fragmentation Costs',
    targetTitle: 'CEPR Tariff Incidence in Vertical Production Networks',
    type: 'causal hypothesis',
    rationale: 'The CEPR micro-level findings provide direct empirical verification for the theoretical supply-chain intermediate markup mechanisms assumed in the IMF multi-country trade model.',
    confidence: 'established'
  },
  {
    id: 'conn-pboc-liquidity-fed',
    sourceId: 'story-china-pboc-liquidity-2026',
    targetId: 'story-fed-qt-calibration-2026',
    sourceTitle: 'PBOC Cuts RRR and Deploys Targeted Refinancing',
    targetTitle: 'Fed Moderates Balance Sheet Runoff Pace',
    type: 'contradictory evidence',
    rationale: 'Contrasts divergent monetary regimes: while Western central banks operate market-wide interest rate and reserve instruments, the PBOC relies heavily on quantitative reserve mandates and directed sectoral credit rationing.',
    confidence: 'established'
  }
];

export const initialIndicators: EconomicIndicator[] = [
  {
    id: 'ind-us-fed-funds',
    name: 'US Federal Funds Target Rate (Upper Bound)',
    category: 'rates',
    jurisdiction: 'United States',
    latestObservation: 4.50,
    unit: '%',
    referencePeriod: 'November 2026',
    releaseDate: '2026-11-06',
    previousObservation: 4.75,
    revision: 'Target lowered 25 bps at Nov FOMC meeting',
    history: [
      { date: '2026-01', value: 5.25 },
      { date: '2026-03', value: 5.25 },
      { date: '2026-05', value: 5.00 },
      { date: '2026-07', value: 5.00 },
      { date: '2026-09', value: 4.75 },
      { date: '2026-11', value: 4.50 }
    ],
    significance: 'Primary nominal benchmark anchor for global dollar risk-free rates and borrowing conditions.'
  },
  {
    id: 'ind-ecb-dfr',
    name: 'ECB Deposit Facility Rate (DFR)',
    category: 'rates',
    jurisdiction: 'Eurozone',
    latestObservation: 3.25,
    unit: '%',
    referencePeriod: 'October 2026',
    releaseDate: '2026-10-29',
    previousObservation: 3.50,
    history: [
      { date: '2026-01', value: 4.00 },
      { date: '2026-04', value: 3.75 },
      { date: '2026-06', value: 3.75 },
      { date: '2026-09', value: 3.50 },
      { date: '2026-10', value: 3.25 }
    ],
    significance: 'Governs remuneration on bank overnight excess reserves across the Eurosystem.'
  },
  {
    id: 'ind-us-cpi-core',
    name: 'US Core Consumer Price Index (YoY)',
    category: 'inflation',
    jurisdiction: 'United States',
    latestObservation: 2.8,
    unit: '% YoY',
    referencePeriod: 'October 2026',
    releaseDate: '2026-11-08',
    previousObservation: 2.9,
    revision: 'Revised from 3.0% preliminary estimate',
    history: [
      { date: '2026-05', value: 3.3 },
      { date: '2026-06', value: 3.2 },
      { date: '2026-07', value: 3.1 },
      { date: '2026-08', value: 3.0 },
      { date: '2026-09', value: 2.9 },
      { date: '2026-10', value: 2.8 }
    ],
    significance: 'Excludes volatile food and energy; key metric for Fed underlying disinflation progress.'
  },
  {
    id: 'ind-euro-hicp',
    name: 'Euro Area Harmonised Index of Consumer Prices (YoY)',
    category: 'inflation',
    jurisdiction: 'Eurozone',
    latestObservation: 2.1,
    unit: '% YoY',
    referencePeriod: 'October 2026 (Flash)',
    releaseDate: '2026-11-04',
    previousObservation: 1.9,
    history: [
      { date: '2026-05', value: 2.5 },
      { date: '2026-06', value: 2.4 },
      { date: '2026-07', value: 2.2 },
      { date: '2026-08', value: 2.0 },
      { date: '2026-09', value: 1.9 },
      { date: '2026-10', value: 2.1 }
    ],
    significance: 'Primary price stability target metric for the European Central Bank.'
  },
  {
    id: 'ind-us-yield-spread-10y2y',
    name: 'US 10-Year minus 2-Year Treasury Yield Spread',
    category: 'stability',
    jurisdiction: 'United States',
    latestObservation: 18,
    unit: 'basis points',
    referencePeriod: 'November 2026 Daily',
    releaseDate: '2026-11-08',
    previousObservation: 12,
    history: [
      { date: '2026-06', value: -25 },
      { date: '2026-07', value: -14 },
      { date: '2026-08', value: -4 },
      { date: '2026-09', value: 8 },
      { date: '2026-10', value: 12 },
      { date: '2026-11', value: 18 }
    ],
    significance: 'Un-inversion of the yield curve historically marks the transition from monetary pause to easing cycle.'
  },
  {
    id: 'ind-us-unemployment-rate',
    name: 'US U-3 Unemployment Rate',
    category: 'labor',
    jurisdiction: 'United States',
    latestObservation: 4.2,
    unit: '%',
    referencePeriod: 'October 2026',
    releaseDate: '2026-11-06',
    previousObservation: 4.1,
    history: [
      { date: '2026-05', value: 3.9 },
      { date: '2026-06', value: 4.0 },
      { date: '2026-07', value: 4.1 },
      { date: '2026-08', value: 4.2 },
      { date: '2026-09', value: 4.1 },
      { date: '2026-10', value: 4.2 }
    ],
    significance: 'Labor market tightness measure; inputs into Sahm Rule recession indicators.'
  },
  {
    id: 'ind-china-gdp-yoy',
    name: 'China Real GDP Growth (YoY)',
    category: 'macro',
    jurisdiction: 'China',
    latestObservation: 4.8,
    unit: '% YoY',
    referencePeriod: 'Q3 2026',
    releaseDate: '2026-10-18',
    previousObservation: 4.7,
    history: [
      { date: '2025-Q3', value: 4.9 },
      { date: '2025-Q4', value: 5.2 },
      { date: '2026-Q1', value: 5.1 },
      { date: '2026-Q2', value: 4.7 },
      { date: '2026-Q3', value: 4.8 }
    ],
    significance: 'Macroeconomic pulse of the world\'s second largest economy and prime commodities consumer.'
  },
  {
    id: 'ind-global-fx-basis',
    name: '3-Month EUR/USD Cross-Currency Basis Swap Spread',
    category: 'external',
    jurisdiction: 'Global',
    latestObservation: -12.4,
    unit: 'basis points',
    referencePeriod: 'November 2026',
    releaseDate: '2026-11-08',
    previousObservation: -9.5,
    history: [
      { date: '2026-06', value: -7.2 },
      { date: '2026-07', value: -8.0 },
      { date: '2026-08', value: -7.8 },
      { date: '2026-09', value: -8.5 },
      { date: '2026-10', value: -9.5 },
      { date: '2026-11', value: -12.4 }
    ],
    significance: 'Measures offshore US dollar funding premium and intermediary balance sheet tightness under Covered Interest Parity.'
  }
];
