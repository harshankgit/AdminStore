import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CreateCategory: React.FC = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setCatLoading(true);
    setCatError(null);
    try {
      const data = await api.get('/categories');
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      setCatError(err?.message || 'Failed to load categories');
    } finally {
      setCatLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await api.post('/categories', { name });
      setSuccess('Category created successfully!');
      setName('');
      fetchCategories();
    } catch (err: any) {
      setError(err?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Category</h2>
      {success && <div className="alert alert-success mb-4">{success}</div>}
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="input input-bordered w-full"
            placeholder="Enter category name"
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary px-8" disabled={loading}>
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Existing Categories</h3>
        {deleteError && <div className="alert alert-error mb-2">{deleteError}</div>}
        {catLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : catError ? (
          <div className="text-error">{catError}</div>
        ) : categories.length === 0 ? (
          <div className="text-gray-400">No categories found.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories.map(cat => (
              <li key={cat._id} className="py-2 px-1 flex items-center justify-between">
                <span>{cat.name}</span>
                <button
                  className="btn btn-xs btn-error ml-4"
                  onClick={() => handleDelete(cat._id)}
                  disabled={deletingId === cat._id}
                >
                  {deletingId === cat._id ? 'Deleting...' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CreateCategory;
