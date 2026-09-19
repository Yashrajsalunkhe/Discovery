import React, { useState } from 'react';
import { SearchIcon, RefreshCwIcon, CheckCircleIcon, XCircleIcon, UsersIcon } from 'lucide-react';
import { Navbar, FooterLanding } from '@/components/landing';

interface TeamMemberResult {
  name: string;
  college: string;
}

interface RegistrationResult {
  registrationId: number;
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderCollege: string;
  selectedEvent: string;
  participationType: 'solo' | 'team';
  teamSize: number;
  teamMembers: TeamMemberResult[];
  totalFee: number;
  createdAt: string;
}

const CheckStatus: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<RegistrationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }
    return '/api';
  };

  const API_BASE = getApiBaseUrl();

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setError('Please enter at least 3 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    setResults([]);

    try {
      const res = await fetch(`${API_BASE}/registration/status?query=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        throw new Error(`Server error (${res.status})`);
      }

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Lookup failed.');
      } else {
        setResults(data.data || []);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please try again later.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Shared styles
  const monoFont: React.CSSProperties = { fontFamily: "var(--f-mono, 'IBM Plex Mono', monospace)" };
  const displayFont: React.CSSProperties = { fontFamily: "var(--f-display, 'Unbounded', sans-serif)" };
  const brutCard: React.CSSProperties = {
    background: '#FFFFFF',
    border: '2px solid #0F1115',
    boxShadow: '4px 4px 0px #0F1115',
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8' }}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pt-24 pb-16">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ── Header ── */}
          <div className="text-center space-y-3 mb-8">
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ ...displayFont, color: '#0F1115' }}
            >
              CHECK REGISTRATION
              <span
                className="ml-2 inline-block text-[11px] font-bold px-1.5 py-0.5 align-super"
                style={{
                  background: '#FFCC00',
                  border: '1px solid #0F1115',
                  color: '#0F1115',
                  ...monoFont,
                }}
              >
                STATUS
              </span>
            </h1>
            <p
              className="text-sm font-medium tracking-wide max-w-md mx-auto"
              style={{ ...monoFont, color: '#5E6672' }}
            >
              Look up your registration using your mobile number, email address, or registration ID.
            </p>
          </div>

          {/* ── Search Card ── */}
          <div style={brutCard}>
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ borderBottom: '2px solid #0F1115' }}
            >
              <div
                className="w-9 h-9 flex items-center justify-center shrink-0"
                style={{
                  background: '#FFCC00',
                  border: '2px solid #0F1115',
                  boxShadow: '2px 2px 0px #0F1115',
                }}
              >
                <SearchIcon className="w-4 h-4" style={{ color: '#0F1115' }} />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-tight" style={{ ...displayFont, color: '#0F1115' }}>
                  FIND YOUR REGISTRATION
                </h2>
                <p className="text-[11px] font-medium tracking-wider" style={{ ...monoFont, color: '#97A0AC' }}>
                  Enter email, mobile number, or reg. ID
                </p>
              </div>
            </div>

            <div className="px-5 py-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. john@email.com, 9876543210, or 42"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 text-sm outline-none placeholder:text-[#97A0AC]"
                  style={{
                    background: '#FAFAF8',
                    border: '2px solid #0F1115',
                    color: '#0F1115',
                    ...monoFont,
                  }}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all shrink-0"
                  style={{
                    background: '#FFCC00',
                    color: '#0F1115',
                    border: '2px solid #0F1115',
                    boxShadow: '3px 3px 0px #0F1115',
                    ...monoFont,
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translate(2px, 2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '1px 1px 0px #0F1115';
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = '';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0px #0F1115';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = '';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0px #0F1115';
                  }}
                >
                  {loading ? (
                    <>
                      <RefreshCwIcon className="w-4 h-4 animate-spin" />
                      <span>SEARCHING…</span>
                    </>
                  ) : (
                    <>
                      <SearchIcon className="w-4 h-4" />
                      <span>SEARCH</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ background: '#FEE2E2', border: '2px solid #0F1115' }}
                >
                  <XCircleIcon className="w-5 h-5 shrink-0" style={{ color: '#E14B4B' }} />
                  <p className="text-xs font-bold" style={{ ...monoFont, color: '#0F1115' }}>{error}</p>
                </div>
              )}

              {/* No results */}
              {searched && !loading && !error && results.length === 0 && (
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ background: '#FEF3C7', border: '2px solid #0F1115' }}
                >
                  <SearchIcon className="w-5 h-5 shrink-0" style={{ color: '#92400E' }} />
                  <p className="text-xs font-bold" style={{ ...monoFont, color: '#0F1115' }}>
                    No registrations found. Please double-check your details and try again.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Results ── */}
          {results.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-bold tracking-widest" style={{ ...monoFont, color: '#5E6672' }}>
                {results.length} REGISTRATION{results.length > 1 ? 'S' : ''} FOUND
              </p>

              {results.map((reg) => (
                <div key={`${reg.registrationId}-${reg.selectedEvent}`} style={brutCard}>
                  {/* Status banner */}
                  <div
                    className="flex items-center justify-between px-5 py-3"
                    style={{ background: '#0F1115', borderBottom: '2px solid #0F1115' }}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4" style={{ color: '#22C55E' }} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ ...monoFont, color: '#FFCC00' }}>
                        CONFIRMED
                      </span>
                    </div>
                    <span className="text-xs font-bold" style={{ ...monoFont, color: '#EDEAE2' }}>
                      #{reg.registrationId}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="px-5 py-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      <DetailRow label="NAME" value={reg.leaderName} monoFont={monoFont} />
                      <DetailRow label="EVENT" value={reg.selectedEvent} monoFont={monoFont} highlight />
                      <DetailRow label="EMAIL" value={reg.leaderEmail} monoFont={monoFont} />
                      <DetailRow label="MOBILE" value={reg.leaderMobile} monoFont={monoFont} />
                      <DetailRow label="COLLEGE" value={reg.leaderCollege} monoFont={monoFont} />
                      <DetailRow label="TYPE" value={reg.participationType.toUpperCase()} monoFont={monoFont} />
                      <DetailRow label="FEE PAID" value={`₹${reg.totalFee}`} monoFont={monoFont} />
                      <DetailRow
                        label="DATE"
                        value={new Date(reg.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        monoFont={monoFont}
                      />
                    </div>

                    {/* Team members */}
                    {reg.participationType === 'team' && reg.teamMembers.length > 0 && (
                      <div className="mt-2">
                        <div
                          className="flex items-center gap-2 px-4 py-2.5 mb-2"
                          style={{ background: '#FAFAF8', border: '2px solid #0F1115' }}
                        >
                          <UsersIcon className="w-4 h-4" style={{ color: '#0F1115' }} />
                          <span className="text-[10px] font-bold tracking-widest" style={{ ...monoFont, color: '#0F1115' }}>
                            TEAM MEMBERS ({reg.teamMembers.length})
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {reg.teamMembers.map((m, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between px-4 py-2"
                              style={{ background: '#FFFFFF', border: '1.5px solid #E5E5E0' }}
                            >
                              <span className="text-xs font-semibold" style={{ ...monoFont, color: '#0F1115' }}>
                                {m.name}
                              </span>
                              <span className="text-[11px]" style={{ ...monoFont, color: '#5E6672' }}>
                                {m.college}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <FooterLanding compact />
    </div>
  );
};

/* Small helper component for labelled detail rows */
const DetailRow: React.FC<{
  label: string;
  value: string;
  monoFont: React.CSSProperties;
  highlight?: boolean;
}> = ({ label, value, monoFont, highlight }) => (
  <div>
    <p className="text-[10px] font-bold tracking-widest mb-0.5" style={{ ...monoFont, color: '#97A0AC' }}>
      {label}
    </p>
    {highlight ? (
      <span
        className="inline-block px-2 py-0.5 text-xs font-bold uppercase"
        style={{
          background: '#FFCC00',
          color: '#0F1115',
          border: '1px solid #0F1115',
          ...monoFont,
        }}
      >
        {value}
      </span>
    ) : (
      <p className="text-sm font-semibold" style={{ ...monoFont, color: '#0F1115' }}>
        {value}
      </p>
    )}
  </div>
);

export default CheckStatus;
