import React, { useState } from 'react';
import {
  MapPin,
  Globe,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  Filter,
  Users,
  IndianRupee
} from 'lucide-react';
import { HEATMAP_DATA_INDIA, GLOBAL_HEATMAP_REGIONS } from '../../data/mockData';
import { HeatmapStateData } from '../../types';
import { useApp } from '../../context/AppContext';

export const FraudHeatmap: React.FC = () => {
  const { playSound } = useApp();
  const [mapView, setMapView] = useState<'india' | 'world'>('india');
  const [selectedState, setSelectedState] = useState<HeatmapStateData>(HEATMAP_DATA_INDIA[0]);

  const handleSelectState = (stateData: HeatmapStateData) => {
    playSound('click');
    setSelectedState(stateData);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Geospatial Fraud Observatory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            National & Global Fraud Heatmap
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
            Live geographic density of reported financial cybercrimes, syndicates, and trending modus operandi.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => setMapView('india')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              mapView === 'india'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            India State Heatmap
          </button>
          <button
            onClick={() => setMapView('world')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              mapView === 'world'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Global Syndicates
          </button>
        </div>
      </div>

      {mapView === 'india' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive State List / Zone Visualization */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                State Threat Density Index
              </span>
              <span className="text-[10px] text-slate-400">Select state for forensic report</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
              {HEATMAP_DATA_INDIA.map((state) => {
                const isSelected = state.stateId === selectedState.stateId;
                const isCritical = state.riskSeverity === 'Critical Hotspot';
                return (
                  <div
                    key={state.stateId}
                    onClick={() => handleSelectState(state)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {state.stateName}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                          isCritical
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {state.riskSeverity}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Reported Incidents:</span>
                        <strong className="text-slate-800">
                          {state.reportedCasesCount.toLocaleString()}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Primary Modus:</span>
                        <strong className="text-blue-700">{state.topScamType}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: State Deep Dive Dossier */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    State Threat Dossier
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{selectedState.stateName}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-100 text-red-700">
                  {selectedState.riskSeverity}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-semibold text-slate-500">Avg. Loss Per Victim</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {selectedState.avgVictimLoss}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-semibold text-slate-500">Yearly Incident Growth</div>
                  <div className="text-lg font-black text-red-600 mt-0.5">
                    {selectedState.growthRate}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/60 text-xs text-red-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-red-900">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Predominant Vector: {selectedState.topScamType}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-900/90">
                  Organized cyber networks operating through rented mule accounts target citizens in {selectedState.stateName} using tailored SMS broadcasts and spoofed executive calls.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900">Recommended Citizen Action:</div>
                <ul className="text-[11px] space-y-1 list-disc list-inside">
                  <li>Immediately register suspicious calls on Sanchar Saathi portal.</li>
                  <li>In case of unauthorized debit, dial 1930 within the Golden 2-hour window.</li>
                  <li>Enable dynamic UPI transaction daily limits on your mobile bank app.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Global Map Table View */
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              International Cross-Border Fraud Corridors
            </span>
            <span className="text-xs text-slate-500">Interpol & Global Anti-Scam Alliance</span>
          </div>

          <div className="divide-y divide-slate-100">
            {GLOBAL_HEATMAP_REGIONS.map((region, idx) => (
              <div
                key={idx}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-3 rounded-2xl transition-colors"
              >
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{region.country}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Primary Modus: <strong className="text-blue-700">{region.topScam}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Total Cases 2026</div>
                    <div className="text-sm font-extrabold text-slate-900">{region.cases}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                    {region.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
