import React from 'react';
import { EconomicIndicator } from '../types/index.ts';
import { Globe, ArrowRight, ShieldAlert, Layers, Activity } from 'lucide-react';

interface InternationalFinanceProps {
  indicators: EconomicIndicator[];
}

export const InternationalFinanceView: React.FC<InternationalFinanceProps> = ({ indicators }) => {
  const fxBasisInd = indicators.find((i) => i.id === 'ind-global-fx-basis');

  const swapLines = [
    {
      pair: 'Federal Reserve ↔ European Central Bank',
      type: 'Standing Bilateral Swap Line',
      currency: 'USD / EUR',
      terms: 'Overnight & 7-Day Liquidity Allotment',
      rate: 'SOFR + 25 bps',
      status: 'Active / Precautionary'
    },
    {
      pair: 'Federal Reserve ↔ Bank of Japan',
      type: 'Standing Bilateral Swap Line',
      currency: 'USD / JPY',
      terms: '7-Day & 84-Day Operations',
      rate: 'SOFR + 25 bps',
      status: 'Active / Standing'
    },
    {
      pair: 'Federal Reserve ↔ Bank of England',
      type: 'Standing Bilateral Swap Line',
      currency: 'USD / GBP',
      terms: 'Weekly Allotment',
      rate: 'SOFR + 25 bps',
      status: 'Active / Standing'
    },
    {
      pair: 'Federal Reserve ↔ Swiss National Bank',
      type: 'Standing Bilateral Swap Line',
      currency: 'USD / CHF',
      terms: 'Weekly Allotment',
      rate: 'SOFR + 25 bps',
      status: 'Active / Standing'
    },
    {
      pair: 'People\'s Bank of China ↔ Various Central Banks',
      type: 'Bilateral Local Currency Swap Line Network',
      currency: 'RMB Cross-Border Liquidity Facility',
      terms: 'Targeted Trade & Financial Settlement',
      rate: 'PBOC LPR-linked',
      status: 'Expanding (40+ Jurisdictions)'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Editorial Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
          International Finance, Capital Flows & Currency Swap Architecture
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
          Surveillance of cross-border banking linkages, off-balance-sheet FX swap funding rolls, Covered Interest Parity (CIP) deviations, and central bank swap line liquidity backstops.
        </p>
      </div>

      {/* Hero Panel: FX Swap Vulnerability & Cross-Currency Basis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">
            <Activity className="w-4 h-4" />
            Global Dollar Funding Transmission Monitor
          </div>

          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Off-Balance-Sheet FX Swaps & Cross-Border Non-Bank Vulnerabilities
          </h2>

          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            Non-US financial institutions maintain an estimated $85 trillion in off-balance-sheet US dollar debt via foreign exchange swaps, forwards, and cross-currency basis swaps. Because these obligations are classified as derivative transactions rather than on-balance-sheet debt, they escape standard bank leverage reporting while creating acute roll-over risks during sudden USD appreciation cycles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
            <div className="p-3 bg-stone-50 dark:bg-stone-950/60 rounded border border-stone-200/60 dark:border-stone-800">
              <div className="text-[10px] font-mono uppercase text-stone-500">EUR/USD 3M Basis Spread</div>
              <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100 mt-1">
                {fxBasisInd?.latestObservation ?? -12.4} bps
              </div>
              <div className="text-[10px] text-stone-500 mt-1">Reflects premium paid for USD cash collateral</div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-950/60 rounded border border-stone-200/60 dark:border-stone-800">
              <div className="text-[10px] font-mono uppercase text-stone-500">Global FX Swap Notional</div>
              <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100 mt-1">
                $85+ Trillion
              </div>
              <div className="text-[10px] text-stone-500 mt-1">BIS Triennial Central Bank Survey Baseline</div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-950/60 rounded border border-stone-200/60 dark:border-stone-800">
              <div className="text-[10px] font-mono uppercase text-stone-500">CIP Arbitrage Condition</div>
              <div className="text-lg font-mono font-bold text-amber-800 dark:text-amber-400 mt-1">
                Persistent Wedge
              </div>
              <div className="text-[10px] text-stone-500 mt-1">Dealer balance sheet constraints bind arbitrage</div>
            </div>
          </div>
        </div>

        {/* Theoretical Insight Box */}
        <div className="lg:col-span-4 p-5 bg-stone-100/60 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 rounded-lg space-y-3 text-xs">
          <div className="font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 font-bold text-[10px]">
            Theoretical Foundation: Du, Tepper & Verdelhan (2018)
          </div>
          <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
            Covered Interest Parity (CIP) Deviations
          </h3>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            Standard open-economy macroeconomics posits that covered interest parity is a pure no-arbitrage condition. However, post-2008 bank leverage ratios (such as the Supplementary Leverage Ratio, SLR) impose capital costs on risk-free arbitrage transactions. Consequently, the currency basis acts as a shadow price on primary dealer balance sheet capacity.
          </p>
          <div className="p-2.5 bg-white dark:bg-stone-900 rounded border border-stone-200/80 dark:border-stone-800 font-mono text-[11px] text-stone-800 dark:text-stone-200">
            Cross-Currency Basis: x(t, τ) = y(t, τ) - [y*(t, τ) - ρ(t, τ)] ≠ 0
          </div>
        </div>
      </div>

      {/* Central Bank Standing Swap Lines Registry */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-stone-600" />
          Multilateral Central Bank Currency Swap Arrangements
        </h2>
        <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-lg">
          <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
            <thead className="bg-stone-100/80 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 font-mono text-[10px] uppercase tracking-wider text-stone-500">
              <tr>
                <th className="py-2.5 px-4">Institutions / Arrangement</th>
                <th className="py-2.5 px-4">Facility Type</th>
                <th className="py-2.5 px-4">Currency Pair</th>
                <th className="py-2.5 px-4">Operational Terms</th>
                <th className="py-2.5 px-4">Pricing Formula</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/60 dark:divide-stone-800">
              {swapLines.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-900/40">
                  <td className="py-3 px-4 font-semibold text-stone-900 dark:text-stone-100">{row.pair}</td>
                  <td className="py-3 px-4">{row.type}</td>
                  <td className="py-3 px-4 font-mono font-medium">{row.currency}</td>
                  <td className="py-3 px-4">{row.terms}</td>
                  <td className="py-3 px-4 font-mono text-stone-600 dark:text-stone-400">{row.rate}</td>
                  <td className="py-3 px-4 font-mono text-emerald-800 dark:text-emerald-400 font-medium">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sovereign Debt Sustainability & Capital Account Openness Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            Sovereign Debt Sustainability & Yield Spread Transmission
          </div>
          <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
            Peripheral European vs Core Benchmark Spreads
          </h3>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            The 10-year Italian BTP minus German Bund spread currently trades at 112 bps, anchored by the credible readiness of the ECB's Transmission Protection Instrument (TPI). In the absence of speculative debt shorting, sovereign financing costs reflect member state debt-to-GDP trajectories under the updated European fiscal governance framework.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            Cross-Border Capital Flows & Reserve Composition
          </div>
          <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
            Emerging Market Foreign Exchange Reserve Accumulation
          </h3>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            Central bank reserve diversification strategies show sustained allocation into monetary gold and non-traditional reserve currencies (e.g. Canadian Dollar, Australian Dollar, Renminbi) as a structural hedge against geopolitical fragmentation risks and financial sanctions.
          </p>
        </div>
      </div>

    </div>
  );
};
