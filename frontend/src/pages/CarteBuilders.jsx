import React from 'react';
import { MapPin, Users } from 'lucide-react';

const MOCK_BUILDERS = [
  { name: 'Sarah M.', city: 'Paris', plan: 'Pro', saas: 'InvoiceFlow', lat: 48.85, lng: 2.35 },
  { name: 'Marc D.', city: 'Lyon', plan: 'Starter', saas: 'HRBot', lat: 45.75, lng: 4.83 },
  { name: 'Julie T.', city: 'Bordeaux', plan: 'Pro', saas: 'SaaSName', lat: 44.83, lng: -0.57 },
  { name: 'Alex R.', city: 'Nantes', plan: 'Elite', saas: 'FreelanceAI', lat: 47.21, lng: -1.55 },
  { name: 'Emma V.', city: 'Toulouse', plan: 'Starter', saas: 'MarketBot', lat: 43.6, lng: 1.44 },
  { name: 'Lucas P.', city: 'Strasbourg', plan: 'Pro', saas: 'LegalAI', lat: 48.57, lng: 7.75 },
];

export default function CarteBuilders() {
  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[#F0F0F0] font-semibold text-[28px] mb-1">Carte des builders</h1>
        <p className="text-[rgba(255,255,255,0.5)] text-[15px]">
          Découvre les <strong className="text-[rgba(255,255,255,0.8)] font-semibold">builders de ta région</strong> et connecte-toi avec eux.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        {/* Map placeholder */}
        <div className="bg-[#141414] border border-[#222222] rounded-[10px] overflow-hidden" style={{ minHeight: '450px' }}>
          <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(245,240,232,0.08)] border border-[rgba(245,240,232,0.15)] flex items-center justify-center">
              <MapPin size={28} className="text-[#F5F0E8]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[#F0F0F0] font-semibold text-[16px] mb-2">Carte interactive</h3>
              <p className="text-[rgba(255,255,255,0.4)] text-[13px]">Intégration Mapbox disponible prochainement.</p>
              <p className="text-[rgba(255,255,255,0.3)] text-[12px] mt-1">1 200+ builders sur la carte mondiale</p>
            </div>
            {/* Mock pins visualization */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {MOCK_BUILDERS.map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#222222] rounded-full px-3 py-1">
                  <MapPin size={10} className="text-[#F5F0E8]" />
                  <span className="text-[rgba(255,255,255,0.6)] text-[11px]">{b.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Builders list */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users size={14} className="text-[rgba(255,255,255,0.4)]" strokeWidth={1.5} />
            <span className="text-[rgba(255,255,255,0.4)] text-[12px] uppercase tracking-wider">Builders actifs</span>
          </div>
          <div className="space-y-2">
            {MOCK_BUILDERS.map((builder, i) => (
              <div key={i} className="bg-[#141414] border border-[#222222] rounded-[10px] p-3 flex items-center gap-3 card-hover cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#222222] flex items-center justify-center text-[#F0F0F0] text-[11px] font-bold flex-shrink-0">
                  {builder.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F0F0F0] font-medium text-[13px]">{builder.name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[3px] ${
                      builder.plan === 'Elite' ? 'badge-green' : builder.plan === 'Pro' ? 'badge-cream' : 'badge-neutral'
                    }`}>{builder.plan}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[rgba(255,255,255,0.35)] text-[11px]">
                    <MapPin size={9} /> {builder.city} · {builder.saas}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
