'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, Eye, EyeOff, FileText } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string;
  author: string;
  isPublished: boolean;
  publishedAt: string | null;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

const emptyPost = (): Omit<BlogPost, '_id'> => ({
  slug: '', title: '', excerpt: '', heroImage: '',
  author: 'Admin', isPublished: false, publishedAt: null,
  content: '', metaTitle: '', metaDescription: '',
});

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyPost());
  const [heroImage, setHeroImage] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/blog');
    const data = await res.json();
    if (data.success) setPosts(data.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function openCreate() {
    setEditing(null);
    setForm(emptyPost());
    setHeroImage('');
    setShowForm(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setForm({ ...post });
    setHeroImage(post.heroImage || '');
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, heroImage };

    const url = editing ? `/api/admin/blog/${editing._id}` : '/api/admin/blog';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      fetchPosts();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    fetchPosts();
    setDeleting(null);
  }

  async function togglePublish(post: BlogPost) {
    await fetch(`/api/admin/blog/${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !post.isPublished }),
    });
    fetchPosts();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-sm text-gray-500 mt-1">{posts.length} posts total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white border border-gray-200 rounded-lg p-5 flex gap-4 items-start">
              {/* Thumbnail */}
              <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {post.heroImage ? (
                  <Image src={post.heroImage} alt={post.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">No image</div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex gap-3 text-sm text-gray-500 text-xs">
                  <span>by {post.author}</span>
                  {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                  <span className="text-gray-300">/{post.slug}</span>
                </div>
                {post.excerpt && <p className="mt-1 text-sm text-gray-600 line-clamp-1">{post.excerpt}</p>}
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(post)} title={post.isPublished ? 'Unpublish' : 'Publish'}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition">
                  {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(post)}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 hover:text-blue-700 transition">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(post._id)} disabled={deleting === post._id}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition disabled:opacity-40">
                  {deleting === post._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>No blog posts yet. Create your first post!</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
              <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Post' : 'New Blog Post'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Hero Image */}
              <ImageUploader
                folder="blog"
                value={heroImage}
                onChange={setHeroImage}
                onRemove={() => setHeroImage('')}
                aspectRatio="aspect-video"
                label="Cover Image"
              />

              {/* Title & Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required value={form.title}
                  onChange={e => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
                    setForm(f => ({ ...f, title, slug: editing ? f.slug : slug }));
                  }}
                  placeholder="Best Things to Do in Da Nang 2026"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono" />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (for listing page)</label>
                <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="A short summary of the post that appears on the blog listing page..."
                  rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none" />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <Editor
                    tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
                    value={form.content}
                    onEditorChange={(content) => setForm(f => ({ ...f, content }))}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'image link media | removeformat | code help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:15px }'
                    }}
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700">SEO Meta</p>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                  <input value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                    placeholder={form.title || 'SEO title...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                  <textarea value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))}
                    placeholder="160 characters max for Google..."
                    rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none" />
                </div>
              </div>

              {/* Author & Publish */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                      className="w-4 h-4 accent-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : (editing ? 'Update Post' : 'Create Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
