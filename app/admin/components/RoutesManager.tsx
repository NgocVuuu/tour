'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, X, Save, Loader2,
  Eye, EyeOff, DollarSign, Clock, Tag, List,
} from 'lucide-react';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';

interface Route {
  _id: string;
  slug: string;
  name: string;
  basePrice: number;
  duration: string;
  images: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  isActive: boolean;
}

const emptyRoute = (): Omit<Route, '_id'> => ({
  slug: '', name: '', basePrice: 25, duration: '',
  images: [], highlights: [], inclusions: [], exclusions: [], isActive: true,
});

function tagsToArray(str: string): string[] {
  return str.split('\n').map(s => s.trim()).filter(Boolean);
}
function arrayToTags(arr: string[]): string {
  return arr.join('\n');
}

export default function RoutesManager() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Route | null>(null);

  const [form, setForm] = useState(emptyRoute());
  const [highlightsText, setHighlightsText] = useState('');
  const [inclusionsText, setInclusionsText] = useState('');
  const [exclusionsText, setExclusionsText] = useState('');
  const [heroImage, setHeroImage] = useState('');

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/routes');
    const data = await res.json();
    if (data.success) setRoutes(data.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  function openCreate() {
    setEditing(null);
    setForm(emptyRoute());
    setHighlightsText('');
    setInclusionsText('');
    setExclusionsText('');
    setHeroImage('');
    setShowForm(true);
  }

  function openEdit(route: Route) {
    setEditing(route);
    setForm({ ...route });
    setHighlightsText(arrayToTags(route.highlights));
    setInclusionsText(arrayToTags(route.inclusions));
    setExclusionsText(arrayToTags(route.exclusions));
    setHeroImage(route.images[0] || '');
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      highlights: tagsToArray(highlightsText),
      inclusions: tagsToArray(inclusionsText),
      exclusions: tagsToArray(exclusionsText),
      images: heroImage ? [heroImage, ...form.images.slice(1)] : form.images,
    };

    const url = editing ? `/api/admin/routes/${editing._id}` : '/api/admin/routes';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      fetchRoutes();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this route? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/admin/routes/${id}`, { method: 'DELETE' });
    fetchRoutes();
    setDeleting(null);
  }

  async function toggleActive(route: Route) {
    await fetch(`/api/admin/routes/${route._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !route.isActive }),
    });
    fetchRoutes();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Routes & Prices</h2>
          <p className="text-sm text-gray-500 mt-1">{routes.length} routes total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition">
          <Plus className="w-4 h-4" /> Add Route
        </button>
      </div>

      {/* Routes List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
      ) : (
        <div className="grid gap-4">
          {routes.map((route) => (
            <div key={route._id} className="bg-white border border-gray-200 rounded-lg p-5 flex gap-4 items-start">
              {/* Thumbnail */}
              <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {route.images[0] ? (
                  <Image src={route.images[0]} alt={route.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">No image</div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{route.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${route.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {route.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />${route.basePrice}/car</span>
                  {route.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{route.duration}</span>}
                  <span className="text-gray-400">/{route.slug}</span>
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(route)} title={route.isActive ? 'Deactivate' : 'Activate'}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition">
                  {route.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(route)}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 hover:text-blue-700 transition">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(route._id)} disabled={deleting === route._id}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition disabled:opacity-40">
                  {deleting === route._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          {routes.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Tag className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>No routes yet. Add your first route!</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Route' : 'Add New Route'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Image */}
              <ImageUploader
                folder="routes"
                value={heroImage}
                onChange={setHeroImage}
                onRemove={() => setHeroImage('')}
                aspectRatio="aspect-video"
                label="Cover Image"
              />

              {/* Basic fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Da Nang Airport to Hoi An"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    placeholder="danang-airport-to-hoi-an"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />Price / Car (USD) *</label>
                  <input required type="number" min={0} value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Duration</label>
                  <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="e.g. 45 mins"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 accent-orange-500" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (visible to customers)</label>
                </div>
              </div>

              {/* Highlights / Inclusions / Exclusions */}
              {[
                { label: 'Highlights', state: highlightsText, setState: setHighlightsText, placeholder: 'Door-to-door service\nEnglish-speaking driver' },
                { label: 'Inclusions', state: inclusionsText, setState: setInclusionsText, placeholder: 'Air-conditioned vehicle\nToll fees' },
                { label: 'Exclusions', state: exclusionsText, setState: setExclusionsText, placeholder: 'Meals & beverages\nGratuities' },
              ].map(({ label, state, setState, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <List className="w-3.5 h-3.5" />{label} <span className="text-gray-400 font-normal">(one per line)</span>
                  </label>
                  <textarea value={state} onChange={e => setState(e.target.value)}
                    placeholder={placeholder} rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none" />
                </div>
              ))}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : (editing ? 'Update Route' : 'Create Route')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
