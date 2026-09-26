import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DownloadIcon,
  SearchIcon,
  RefreshCwIcon,
  LogOutIcon,
  UsersIcon,
  UserCheckIcon,
  TrendingUpIcon,
  IndianRupeeIcon,
  CalendarIcon,
  EyeIcon,
  ShieldIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as fileSaver from 'file-saver';
import { Navbar, FooterLanding } from "@/components/landing";

interface TeamMember {
  name: string;
  email: string;
  mobile: string;
  college: string;
}

interface Registration {
  _id: string;
  registrationId: number;
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderCollege: string;
  leaderDepartment: string;
  leaderYear: string;
  leaderCity: string;
  selectedEvent: string;
  paperPresentationDept?: string;
  participationType: 'solo' | 'team';
  teamSize: number;
  teamMembers: TeamMember[];
  paymentId: string;
  orderId: string;
  totalFee: number;
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

interface AvailableFilters {
  availableEvents: string[];
  availableColleges: string[];
  availableDepartments: string[];
  availableYears: string[];
  availableCities: string[];
  availablePaperPresentationDepts: string[];
}

interface AdminStats {
  overview: {
    totalRegistrations: number;
    soloRegistrations: number;
    teamRegistrations: number;
    totalStudents: number;
    totalRevenue: number;
  };
  eventStats: Array<{
    _id: string;
    count: number;
    totalFees: number;
  }>;
  recentRegistrations: Array<{
    _id: string;
    leaderName: string;
    selectedEvent: string;
    createdAt: string;
    totalFee: number;
  }>;
}

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 50
  });
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
    availableEvents: [],
    availableColleges: [],
    availableDepartments: [],
    availableYears: [],
    availableCities: [],
    availablePaperPresentationDepts: [],
  });
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [participationFilter, setParticipationFilter] = useState<string>('all');
  const [paperPresentationDeptFilter, setPaperPresentationDeptFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { toast } = useToast();

  // Use environment variable for API base URL — hostname-only check for reliability
  const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }

    // Only use localhost for actual local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }

    // Production — use relative path routed to backend by Vercel
    return '/api';
  };

  const API_BASE = getApiBaseUrl();

  const appendFilterParams = (params: URLSearchParams) => {
    const filters: Record<string, string> = {
      eventFilter,
      collegeFilter,
      departmentFilter,
      yearFilter,
      cityFilter,
      participationFilter,
      startDate,
      endDate,
      search: searchTerm,
    };

    // Only send paperPresentationDeptFilter when Paper Presentation event is selected
    if (eventFilter === 'Paper Presentation') {
      filters.paperPresentationDeptFilter = paperPresentationDeptFilter;
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.append(key, value);
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setEventFilter('all');
    setCollegeFilter('all');
    setDepartmentFilter('all');
    setYearFilter('all');
    setCityFilter('all');
    setParticipationFilter('all');
    setPaperPresentationDeptFilter('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Check if user is already authenticated
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when token is set and user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchRegistrations();
      fetchStats();
    }
  }, [isAuthenticated, token]);

  // Handle authentication
  const handleLogin = async () => {
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter the admin password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('adminToken', data.token);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Invalid password",
          variant: "destructive"
        });
      }
    } catch (error) {
      let errorMessage = 'Network error';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running and accessible.';
      } else if (errorMessage.includes('NetworkError')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      }

      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    setPassword('');
    localStorage.removeItem('adminToken');
    setRegistrations([]);
    setStats(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  // Fetch registrations with filters
  const fetchRegistrations = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        page: currentPage.toString(),
        limit: '50'
      });

      appendFilterParams(params);

      const url = `${API_BASE}/admin/registrations?${params}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRegistrations(data.data.registrations);
        setPagination(data.data.pagination);
        const filters = data.data.filters || {};
        setAvailableFilters({
          availableEvents: filters.availableEvents || [],
          availableColleges: filters.availableColleges || [],
          availableDepartments: filters.availableDepartments || [],
          availableYears: filters.availableYears || [],
          availableCities: filters.availableCities || [],
          availablePaperPresentationDepts: filters.availablePaperPresentationDepts || [],
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch registrations",
          variant: "destructive"
        });
      }
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      }

      toast({
        title: "Error",
        description: `Failed to fetch registrations: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    if (!token) return;

    try {
      const url = `${API_BASE}/admin/stats`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Export to Excel
  const handleExport = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();

      appendFilterParams(params);

      const url = `${API_BASE}/admin/export?${params}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'same-origin',
      });

      if (response.ok) {
        const blob = await response.blob();
        const fileName = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'registrations.xlsx';
        fileSaver.saveAs(blob, fileName);
        toast({
          title: "Success",
          description: "File downloaded successfully!",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to export data",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect for fetching data when filters change
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchRegistrations();
    }
  }, [eventFilter, collegeFilter, departmentFilter, yearFilter, cityFilter, participationFilter, paperPresentationDeptFilter, startDate, endDate, sortBy, sortOrder, currentPage, searchTerm, isAuthenticated, token]);

  // ═══════════════════════════════════════════════════════════
  //  LOGIN SCREEN — Mission-Control Brutalist
  // ═══════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8' }}>
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div
            className="w-full max-w-md"
            style={{
              background: '#FFFFFF',
              border: '2px solid #0F1115',
              boxShadow: '6px 6px 0px #0F1115',
            }}
          >
            {/* Header band */}
            <div
              className="px-6 py-5 flex items-center gap-4"
              style={{ borderBottom: '2px solid #0F1115' }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center shrink-0"
                style={{
                  background: '#FFCC00',
                  border: '2px solid #0F1115',
                  boxShadow: '2px 2px 0px #0F1115',
                }}
              >
                <ShieldIcon className="w-6 h-6" style={{ color: '#0F1115' }} />
              </div>
              <div>
                <h1
                  className="text-xl font-black tracking-tight"
                  style={{ color: '#0F1115', fontFamily: "var(--f-display, 'Unbounded', sans-serif)" }}
                >
                  ADMIN PANEL
                </h1>
                <p
                  className="text-xs font-bold tracking-wider mt-0.5"
                  style={{ color: '#5E6672', fontFamily: "var(--f-mono, 'IBM Plex Mono', monospace)" }}
                >
                  DISCOVERY ADCET • DASHBOARD ACCESS
                </p>
              </div>
            </div>

            {/* Form body */}
            <div className="px-6 py-8 space-y-6">
              <div className="space-y-2">
                <label
                  className="text-xs font-bold tracking-wider"
                  style={{ color: '#0F1115', fontFamily: "var(--f-mono, monospace)" }}
                >
                  ADMIN PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="Enter password…"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 text-sm outline-none placeholder:text-[#97A0AC]"
                  style={{
                    background: '#FAFAF8',
                    border: '2px solid #0F1115',
                    color: '#0F1115',
                    fontFamily: "var(--f-mono, monospace)",
                  }}
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-all"
                style={{
                  background: '#FFCC00',
                  color: '#0F1115',
                  border: '2px solid #0F1115',
                  boxShadow: '3px 3px 0px #0F1115',
                  fontFamily: "var(--f-mono, monospace)",
                  transform: loading ? 'translate(1px, 1px)' : undefined,
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
                    <RefreshCwIcon className="h-4 w-4 animate-spin" />
                    <span>AUTHENTICATING…</span>
                  </>
                ) : (
                  <>
                    <span>ACCESS DASHBOARD</span>
                    <span className="text-base font-black">↗</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>

        <FooterLanding compact />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  DASHBOARD — Mission-Control Brutalist
  // ═══════════════════════════════════════════════════════════

  // Shared brutalist card style
  const brutCard: React.CSSProperties = {
    background: '#FFFFFF',
    border: '2px solid #0F1115',
    boxShadow: '4px 4px 0px #0F1115',
  };

  const monoFont: React.CSSProperties = {
    fontFamily: "var(--f-mono, 'IBM Plex Mono', monospace)",
  };

  const displayFont: React.CSSProperties = {
    fontFamily: "var(--f-display, 'Unbounded', sans-serif)",
  };

  const statCards = stats
    ? [
      {
        label: 'TOTAL REGISTRATIONS',
        value: stats.overview.totalRegistrations,
        sub: 'All participants',
        icon: <UsersIcon className="w-6 h-6" style={{ color: '#0F1115' }} />,
        accent: '#3D6BFF',
      },
      {
        label: 'TOTAL STUDENTS',
        value: stats.overview.totalStudents,
        sub: 'Including team members',
        icon: <UserCheckIcon className="w-6 h-6" style={{ color: '#0F1115' }} />,
        accent: '#F97316',
      },
      {
        label: 'SOLO',
        value: stats.overview.soloRegistrations,
        sub: 'Individual participants',
        icon: <TrendingUpIcon className="w-6 h-6" style={{ color: '#0F1115' }} />,
        accent: '#22C55E',
      },
      {
        label: 'TEAMS',
        value: stats.overview.teamRegistrations,
        sub: 'Team participants',
        icon: <UsersIcon className="w-6 h-6" style={{ color: '#0F1115' }} />,
        accent: '#A855F7',
      },
      {
        label: 'REVENUE',
        value: `₹${stats.overview.totalRevenue.toLocaleString()}`,
        sub: 'Registration fees',
        icon: <IndianRupeeIcon className="w-6 h-6" style={{ color: '#0F1115' }} />,
        accent: '#FFCC00',
      },
    ]
    : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8' }}>
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto space-y-6">

          {/* ── Header Bar ── */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4"
            style={brutCard}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 flex items-center justify-center shrink-0"
                style={{
                  background: '#FFCC00',
                  border: '2px solid #0F1115',
                  boxShadow: '2px 2px 0px #0F1115',
                }}
              >
                <ShieldIcon className="w-5 h-5" style={{ color: '#0F1115' }} />
              </div>
              <div>
                <h1
                  className="text-lg sm:text-xl font-black tracking-tight"
                  style={{ ...displayFont, color: '#0F1115' }}
                >
                  DISCOVERY ADCET
                  <span
                    className="ml-2 inline-block text-[10px] font-bold px-1.5 py-0.5 align-super"
                    style={{
                      background: '#FFCC00',
                      border: '1px solid #0F1115',
                      color: '#0F1115',
                      ...monoFont,
                    }}
                  >
                    ADMIN
                  </span>
                </h1>
                <p className="text-xs font-semibold tracking-wider mt-0.5" style={{ ...monoFont, color: '#5E6672' }}>
                  MANAGE REGISTRATIONS • EXPORT DATA
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
              style={{
                background: '#FAFAF8',
                color: '#E14B4B',
                border: '2px solid #0F1115',
                boxShadow: '2px 2px 0px #0F1115',
                ...monoFont,
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translate(1px, 1px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '1px 1px 0px #0F1115';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = '';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0px #0F1115';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = '';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0px #0F1115';
              }}
            >
              <LogOutIcon className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* ── Stats Grid ── */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {statCards.map((s) => (
                <div key={s.label} className="flex items-center justify-between px-5 py-5" style={brutCard}>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-widest" style={{ ...monoFont, color: '#5E6672' }}>
                      {s.label}
                    </p>
                    <p className="text-2xl font-black" style={{ ...displayFont, color: '#0F1115' }}>
                      {s.value}
                    </p>
                    <p className="text-[11px] font-medium" style={{ ...monoFont, color: '#97A0AC' }}>
                      {s.sub}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 flex items-center justify-center shrink-0"
                    style={{
                      background: s.accent,
                      border: '2px solid #0F1115',
                      boxShadow: '2px 2px 0px #0F1115',
                    }}
                  >
                    {s.icon}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Controls Bar ── */}
          <div className="px-5 py-5 space-y-4" style={brutCard}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search + Filters */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                {/* Search */}
                <div className="relative flex-1 min-w-0 sm:max-w-[340px]">
                  <SearchIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: '#97A0AC' }}
                  />
                  <input
                    placeholder="Search name, email, mobile, ID…"
                    className="w-full pl-10 pr-4 py-2.5 text-sm outline-none placeholder:text-[#97A0AC]"
                    style={{
                      background: '#FAFAF8',
                      border: '2px solid #0F1115',
                      color: '#0F1115',
                      ...monoFont,
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Event filter */}
                <Select value={eventFilter} onValueChange={(value) => { setEventFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger
                    className="w-full sm:w-48 h-[42px] rounded-none text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: '#FAFAF8',
                      border: '2px solid #0F1115',
                      color: '#0F1115',
                      ...monoFont,
                    }}
                  >
                    <SelectValue placeholder="Filter by event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {availableFilters.availableEvents.map((event) => (
                      <SelectItem key={event} value={event}>{event}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}>
                  <SelectTrigger
                    className="w-full sm:w-48 h-[42px] rounded-none text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: '#FAFAF8',
                      border: '2px solid #0F1115',
                      color: '#0F1115',
                      ...monoFont,
                    }}
                  >
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="leaderName-asc">Name A-Z</SelectItem>
                    <SelectItem value="leaderName-desc">Name Z-A</SelectItem>
                    <SelectItem value="selectedEvent-asc">Event A-Z</SelectItem>
                    <SelectItem value="totalFee-desc">Highest Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={fetchRegistrations}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
                  style={{
                    background: '#FAFAF8',
                    color: '#0F1115',
                    border: '2px solid #0F1115',
                    boxShadow: '2px 2px 0px #0F1115',
                    ...monoFont,
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translate(1px, 1px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '1px 1px 0px #0F1115';
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = '';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0px #0F1115';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = '';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0px #0F1115';
                  }}
                >
                  <RefreshCwIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>

                <button
                  onClick={handleExport}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
                  style={{
                    background: '#FFCC00',
                    color: '#0F1115',
                    border: '2px solid #0F1115',
                    boxShadow: '2px 2px 0px #0F1115',
                    ...monoFont,
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translate(1px, 1px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '1px 1px 0px #0F1115';
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = '';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0px #0F1115';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = '';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0px #0F1115';
                  }}
                >
                  <DownloadIcon className="w-4 h-4" />
                  Export Excel
                </button>
              </div>
            </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Select value={collegeFilter} onValueChange={(value) => { setCollegeFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="h-[42px] rounded-none text-xs font-bold uppercase tracking-wider" style={{ background: '#FAFAF8', border: '2px solid #0F1115', color: '#0F1115', ...monoFont }}>
                    <SelectValue placeholder="College" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
                    {availableFilters.availableColleges.map((college) => <SelectItem key={college} value={college}>{college}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={(value) => { setDepartmentFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="h-[42px] rounded-none text-xs font-bold uppercase tracking-wider" style={{ background: '#FAFAF8', border: '2px solid #0F1115', color: '#0F1115', ...monoFont }}>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {availableFilters.availableDepartments.map((department) => <SelectItem key={department} value={department}>{department}</SelectItem>)}
                  </SelectContent>
                </Select>

                {/* Paper Presentation Department filter — only visible when PP event is selected */}
                {eventFilter === 'Paper Presentation' && (
                  <Select value={paperPresentationDeptFilter} onValueChange={(value) => { setPaperPresentationDeptFilter(value); setCurrentPage(1); }}>
                    <SelectTrigger className="h-[42px] rounded-none text-xs font-bold uppercase tracking-wider" style={{ background: '#3D6BFF', border: '2px solid #0F1115', color: '#FFFFFF', ...monoFont }}>
                      <SelectValue placeholder="PP Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All PP Departments</SelectItem>
                      {availableFilters.availablePaperPresentationDepts.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}

                <Select value={yearFilter} onValueChange={(value) => { setYearFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="h-[42px] rounded-none text-xs font-bold uppercase tracking-wider" style={{ background: '#FAFAF8', border: '2px solid #0F1115', color: '#0F1115', ...monoFont }}>
                    <SelectValue placeholder="Study year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Study Years</SelectItem>
                    {availableFilters.availableYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={cityFilter} onValueChange={(value) => { setCityFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="h-[42px] rounded-none text-xs font-bold uppercase tracking-wider" style={{ background: '#FAFAF8', border: '2px solid #0F1115', color: '#0F1115', ...monoFont }}>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {availableFilters.availableCities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={participationFilter} onValueChange={(value) => { setParticipationFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="h-[42px] rounded-none text-xs font-bold uppercase tracking-wider" style={{ background: '#FAFAF8', border: '2px solid #0F1115', color: '#0F1115', ...monoFont }}>
                    <SelectValue placeholder="Participation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Participation</SelectItem>
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>

                <label className="flex items-center gap-2 h-[42px] px-3 text-xs font-bold uppercase tracking-wider" style={{ background: '#FAFAF8', border: '2px solid #0F1115', color: '#5E6672', ...monoFont }}>
                  <span className="whitespace-nowrap">From</span>
                  <input type="date" value={startDate} max={endDate || undefined} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className="min-w-0 flex-1 bg-transparent text-[#0F1115] outline-none" />
                </label>

                <label className="flex items-center gap-2 h-[42px] px-3 text-xs font-bold uppercase tracking-wider" style={{ background: '#FAFAF8', border: '2px solid #0F1115', color: '#5E6672', ...monoFont }}>
                  <span className="whitespace-nowrap">To</span>
                  <input type="date" value={endDate} min={startDate || undefined} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="min-w-0 flex-1 bg-transparent text-[#0F1115] outline-none" />
                </label>

                <button onClick={clearFilters} className="h-[42px] px-4 text-xs font-bold uppercase tracking-wider" style={{ background: '#F5F4F0', color: '#0F1115', border: '2px solid #0F1115', ...monoFont }}>
                  Clear Filters
                </button>
              </div>
          </div>

          {/* ── Registrations Table ── */}
          <div style={brutCard}>
            {/* Table header band */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: '2px solid #0F1115' }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0"
                style={{
                  background: '#FFCC00',
                  border: '2px solid #0F1115',
                  boxShadow: '2px 2px 0px #0F1115',
                }}
              >
                <CalendarIcon className="w-4 h-4" style={{ color: '#0F1115' }} />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-tight" style={{ ...displayFont, color: '#0F1115' }}>
                  REGISTRATIONS ({pagination.totalCount})
                </h2>
                <p className="text-[11px] font-medium tracking-wider" style={{ ...monoFont, color: '#5E6672' }}>
                  Showing {registrations.length} of {pagination.totalCount}
                </p>
              </div>
            </div>

            {registrations.length === 0 ? (
              <div
                className="px-5 py-12 text-center"
                style={{ ...monoFont, color: '#5E6672' }}
              >
                <p className="text-sm font-bold tracking-wider">NO REGISTRATIONS FOUND</p>
                <p className="text-xs mt-1">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ ...monoFont, color: '#0F1115' }}>
                  <thead>
                    <tr style={{ background: '#0F1115' }}>
                      {[
                        'Reg. ID', 'Date', 'Leader', 'Email', 'Mobile', 'College', 'Department', 'Year',
                        'Event', 'PP Dept',
                        'Type', 'Size', 'Team', 'Fee', 'Payment ID'
                      ].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                            style={{ color: '#FFCC00', borderBottom: '2px solid #0F1115' }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, idx) => (
                      <tr
                        key={reg._id}
                        style={{
                          background: idx % 2 === 0 ? '#FFFFFF' : '#F5F4F0',
                          borderBottom: '1px solid #E5E5E0',
                        }}
                      >
                        <td className="px-3 py-3 text-xs font-bold whitespace-nowrap" style={{ color: '#3D6BFF' }}>
                          #{reg.registrationId}
                        </td>
                        <td className="px-3 py-3 text-xs whitespace-nowrap">
                          {new Date(reg.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-3 py-3 text-xs font-semibold whitespace-nowrap">
                          {reg.leaderName}
                        </td>
                        <td className="px-3 py-3 text-[11px] whitespace-nowrap">{reg.leaderEmail}</td>
                        <td className="px-3 py-3 text-xs whitespace-nowrap">{reg.leaderMobile}</td>
                        <td className="px-3 py-3 text-[11px] max-w-[180px] truncate">{reg.leaderCollege}</td>
                        <td className="px-3 py-3 text-[11px] whitespace-nowrap">{reg.leaderDepartment}</td>
                        <td className="px-3 py-3 text-[11px] whitespace-nowrap">{reg.leaderYear}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              background: '#FFCC00',
                              color: '#0F1115',
                              border: '1px solid #0F1115',
                            }}
                          >
                            {reg.selectedEvent}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              background: reg.paperPresentationDept ? '#3D6BFF' : '#F5F4F0',
                              color: reg.paperPresentationDept ? '#FFFFFF' : '#5E6672',
                              border: '1px solid #0F1115',
                            }}
                          >
                            {reg.paperPresentationDept || 'N/A'}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              background: reg.participationType === 'solo' ? '#0F1115' : '#FAFAF8',
                              color: reg.participationType === 'solo' ? '#FFCC00' : '#0F1115',
                              border: '1px solid #0F1115',
                            }}
                          >
                            {reg.participationType}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-center">{reg.teamSize}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {reg.participationType === 'team' && reg.teamMembers.length > 0 ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all"
                                  style={{
                                    background: '#FAFAF8',
                                    color: '#0F1115',
                                    border: '1.5px solid #0F1115',
                                    boxShadow: '1.5px 1.5px 0px #0F1115',
                                    ...monoFont,
                                  }}
                                >
                                  <EyeIcon className="w-3 h-3" />
                                  View
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl rounded-none" style={{ border: '2px solid #0F1115', background: '#FAFAF8' }}>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2 text-base font-black" style={{ ...displayFont, color: '#0F1115' }}>
                                    <UsersIcon className="w-5 h-5" />
                                    Team — {reg.leaderName}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-2">
                                  {/* Leader */}
                                  <div className="px-4 py-3" style={{ background: '#FFCC00', border: '2px solid #0F1115' }}>
                                    <h4 className="text-[10px] font-bold tracking-widest mb-2" style={{ ...monoFont, color: '#0F1115' }}>
                                      TEAM LEADER
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs" style={{ ...monoFont, color: '#0F1115' }}>
                                      <div><span className="font-bold">Name:</span> {reg.leaderName}</div>
                                      <div><span className="font-bold">Email:</span> {reg.leaderEmail}</div>
                                      <div><span className="font-bold">Mobile:</span> {reg.leaderMobile}</div>
                                      <div><span className="font-bold">College:</span> {reg.leaderCollege}</div>
                                      <div><span className="font-bold">Department:</span> {reg.leaderDepartment}</div>
                                      <div><span className="font-bold">Year:</span> {reg.leaderYear}</div>
                                      {reg.paperPresentationDept && (
                                        <div className="col-span-2"><span className="font-bold">PP Department:</span> {reg.paperPresentationDept}</div>
                                      )}
                                    </div>
                                  </div>
                                  {/* Members */}
                                  {reg.teamMembers.length > 0 && (
                                    <div>
                                      <h4 className="text-[10px] font-bold tracking-widest mb-2" style={{ ...monoFont, color: '#5E6672' }}>
                                        MEMBERS ({reg.teamMembers.length})
                                      </h4>
                                      <div className="space-y-2">
                                        {reg.teamMembers.map((member, i) => (
                                          <div
                                            key={i}
                                            className="px-4 py-3"
                                            style={{ background: '#FFFFFF', border: '2px solid #0F1115' }}
                                          >
                                            <div className="grid grid-cols-2 gap-3 text-xs" style={{ ...monoFont, color: '#0F1115' }}>
                                              <div><span className="font-bold">Name:</span> {member.name}</div>
                                              <div><span className="font-bold">Mobile:</span> {member.mobile}</div>
                                              <div><span className="font-bold">College:</span> {member.college}</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  <p className="text-[10px] font-bold tracking-wider" style={{ ...monoFont, color: '#97A0AC' }}>
                                    TOTAL SIZE: {reg.teamSize} MEMBERS
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span
                              className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              style={{ background: '#F5F4F0', color: '#5E6672', border: '1px solid #E5E5E0' }}
                            >
                              Solo
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-xs font-bold whitespace-nowrap">₹{reg.totalFee}</td>
                        <td className="px-3 py-3 text-[10px] whitespace-nowrap" style={{ color: '#5E6672' }}>
                          {reg.paymentId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderTop: '2px solid #0F1115' }}
              >
                <p className="text-[11px] font-bold tracking-wider" style={{ ...monoFont, color: '#5E6672' }}>
                  PAGE {pagination.currentPage} OF {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.currentPage <= 1}
                    onClick={() => setCurrentPage(pagination.currentPage - 1)}
                    className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40"
                    style={{
                      background: '#FAFAF8',
                      color: '#0F1115',
                      border: '2px solid #0F1115',
                      boxShadow: '2px 2px 0px #0F1115',
                      ...monoFont,
                    }}
                  >
                    <ChevronLeftIcon className="w-3 h-3" />
                    Prev
                  </button>
                  <button
                    disabled={pagination.currentPage >= pagination.totalPages}
                    onClick={() => setCurrentPage(pagination.currentPage + 1)}
                    className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40"
                    style={{
                      background: '#FAFAF8',
                      color: '#0F1115',
                      border: '2px solid #0F1115',
                      boxShadow: '2px 2px 0px #0F1115',
                      ...monoFont,
                    }}
                  >
                    Next
                    <ChevronRightIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <FooterLanding compact />
    </div>
  );
};

export default AdminPanel;