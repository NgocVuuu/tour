'use client';

import { useState } from 'react';
import { Menu, X, Bell, Settings, LogOut, LayoutDashboard, Calendar, MapPin, FileText, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RoutesManager from './components/RoutesManager';
import BlogManager from './components/BlogManager';

type NavId = 'dashboard' | 'bookings' | 'routes' | 'blog' | 'settings';

const navItems: { id: NavId; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'routes', label: 'Routes & Prices', icon: MapPin },
  { id: 'blog', label: 'Blog Posts', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const stats = [
  { title: 'New Bookings (Today)', value: '—', icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { title: 'Revenue (This Month)', value: '—', icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-50' },
  { title: 'Conversion Rate', value: '—', icon: TrendingUp, color: 'text-orange-500', bgColor: 'bg-orange-50' },
];

const recentBookings = [
  { id: 'DN-1024', name: 'John Doe', dateTime: 'Today, 14:00', route: 'DAD to Hoi An', pax: 2, status: 'Pending', statusColor: 'bg-yellow-100 text-yellow-800' },
  { id: 'DN-1023', name: 'Sarah Smith', dateTime: 'Yesterday 09:00', route: 'Hoi An to Da Nang', pax: 3, status: 'Confirmed', statusColor: 'bg-green-100 text-green-800' },
  { id: 'DN-1022', name: 'Michael Brown', dateTime: 'Oct 16, 16:30', route: 'Da Nang to Ba Na', pax: 1, status: 'Completed', statusColor: 'bg-gray-100 text-gray-800' },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>('dashboard');
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  }

  function renderContent() {
    if (activeNav === 'routes') return <RoutesManager />;
    if (activeNav === 'blog') return <BlogManager />;
    if (activeNav === 'bookings') return <BookingsManager />;
    if (activeNav === 'settings') return <SettingsPanel />;
    return <DashboardHome />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-900">DaNang Transfer</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setActiveNav(id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm ${activeNav === id ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 space-y-1">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="font-semibold text-gray-800 text-lg capitalize">
            {navItems.find(n => n.id === activeNav)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-3 ml-auto">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

/* ─── Dashboard Home ─────────────────────────────────────────────────────── */
function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">{s.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{s.value}</p>
              </div>
              <div className={`${s.bgColor} p-3 rounded-lg`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent bookings table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Route</th>
                <th className="px-6 py-3">Pax</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-orange-600">{b.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{b.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.dateTime}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.route}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.pax}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${b.statusColor}`}>{b.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-700 font-medium">
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import BookingsManager from './components/BookingsManager';

/* ─── Settings Panel ─────────────────────────────────────────────────────── */
function SettingsPanel() {
  const [rates, setRates] = useState({ USD: 1, EUR: 0.92, AUD: 1.58, VND: 25400 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exchangeRates: rates }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchange Rates</h2>
      <form onSubmit={handleSave} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {(['USD', 'EUR', 'AUD', 'VND'] as const).map((cur) => (
          <div key={cur}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{cur} Rate</label>
            <input type="number" step="0.0001" value={rates[cur]}
              onChange={e => setRates(r => ({ ...r, [cur]: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
          </div>
        ))}
        <button type="submit" disabled={saving}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60 transition">
          {saved ? '✅ Saved!' : saving ? 'Saving...' : 'Save Exchange Rates'}
        </button>
      </form>
    </div>
  );
}
