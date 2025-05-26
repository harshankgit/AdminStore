import React, { useState } from 'react';
import api from '../../services/api';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  comparePrice: string;
  images: string[];
  category: string;
  inventory: string;
  features: string[];
  specifications: { key: string; value: string }[];
  rating: { average: string; count: string };
}

const initialForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  comparePrice: '',
  images: [''],
  category: '', // will store category id
  inventory: '',
  features: [''],
  specifications: [{ key: '', value: '' }],
  rating: { average: '', count: '' },
};

const AddProduct: React.FC = () => {
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true);
      setCatError(null);
      try {
        const data = await api.get('/categories');
        // Support both {data:[]} or [] shape
        setCategories(Array.isArray(data) ? data : data.data || []);
      } catch (err: any) {
        setCatError(err?.message || 'Failed to load categories');
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, category: e.target.value });
  };

  // Handlers for dynamic fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('rating.')) {
      setForm({ ...form, rating: { ...form.rating, [name.split('.')[1]]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleArrayChange = (field: keyof ProductForm, idx: number, value: string) => {
    const arr = [...(form[field] as string[])];
    arr[idx] = value;
    setForm({ ...form, [field]: arr });
  };

  const addArrayField = (field: keyof ProductForm) => {
    setForm({ ...form, [field]: [...(form[field] as string[]), ''] });
  };

  const removeArrayField = (field: keyof ProductForm, idx: number) => {
    const arr = [...(form[field] as string[])];
    arr.splice(idx, 1);
    setForm({ ...form, [field]: arr });
  };

  // Specifications (key-value pairs)
  const handleSpecChange = (idx: number, key: string, value: string) => {
    const specs = [...form.specifications];
    specs[idx] = { key, value };
    setForm({ ...form, specifications: specs });
  };

  const addSpecField = () => {
    setForm({ ...form, specifications: [...form.specifications, { key: '', value: '' }] });
  };

  const removeSpecField = (idx: number) => {
    const specs = [...form.specifications];
    specs.splice(idx, 1);
    setForm({ ...form, specifications: specs });
  };

  const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setSuccess(null);
  setError(null);
  try {
    // Prepare product data
    const productData = {
      ...form,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
      inventory: parseInt(form.inventory, 10),
      rating: {
        average: form.rating.average ? parseFloat(form.rating.average) : 0,
        count: form.rating.count ? parseInt(form.rating.count, 10) : 0,
      },
      specifications: form.specifications.reduce((acc, curr) => {
        if (curr.key) acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>),
    };
    await api.post('/products', productData);
    setSuccess('Product added successfully!');
    setForm(initialForm);
  } catch (err: any) {
    setError(err?.message || 'Failed to add product');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      {success && <div className="alert alert-success mb-4">{success}</div>}
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="input input-bordered w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
  name="category"
  value={form.category}
  onChange={handleCategoryChange}
  required
  className="input input-bordered w-full"
  disabled={catLoading}
>
  <option value="">Select category</option>
  {categories.map(cat => (
    <option key={cat._id} value={cat._id}>{cat.name}</option>
  ))}
</select>
{catError && <div className="text-error text-xs mt-1">{catError}</div>}
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required className="textarea textarea-bordered w-full min-h-[80px]" />
        </div>
        {/* Price & Compare Price & Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required className="input input-bordered w-full" min="0" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Compare Price</label>
            <input type="number" name="comparePrice" value={form.comparePrice} onChange={handleChange} className="input input-bordered w-full" min="0" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inventory</label>
            <input type="number" name="inventory" value={form.inventory} onChange={handleChange} required className="input input-bordered w-full" min="0" />
          </div>
        </div>
        {/* Images (array) */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Images</label>
          {form.images.map((img, idx) => (
            <div className="flex gap-2 mb-2" key={idx}>
              <input
                type="text"
                value={img}
                onChange={e => handleArrayChange('images', idx, e.target.value)}
                placeholder={`Image URL #${idx + 1}`}
                className="input input-bordered w-full"
                required={idx === 0}
              />
              <button type="button" className="btn btn-error btn-sm" onClick={() => removeArrayField('images', idx)} disabled={form.images.length === 1}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-primary btn-sm mt-1" onClick={() => addArrayField('images')}>Add Image</button>
        </div>
        {/* Features (array) */}
        <div>
          <label className="block text-sm font-medium mb-1">Features</label>
          {form.features.map((feature, idx) => (
            <div className="flex gap-2 mb-2" key={idx}>
              <input
                type="text"
                value={feature}
                onChange={e => handleArrayChange('features', idx, e.target.value)}
                placeholder={`Feature #${idx + 1}`}
                className="input input-bordered w-full"
                required={idx === 0}
              />
              <button type="button" className="btn btn-error btn-sm" onClick={() => removeArrayField('features', idx)} disabled={form.features.length === 1}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-primary btn-sm mt-1" onClick={() => addArrayField('features')}>Add Feature</button>
        </div>
        {/* Specifications (key-value) */}
        <div>
          <label className="block text-sm font-medium mb-1">Specifications</label>
          {form.specifications.map((spec, idx) => (
            <div className="flex gap-2 mb-2" key={idx}>
              <input
                type="text"
                value={spec.key}
                onChange={e => handleSpecChange(idx, e.target.value, spec.value)}
                placeholder="Key"
                className="input input-bordered w-1/3"
                required={idx === 0}
              />
              <input
                type="text"
                value={spec.value}
                onChange={e => handleSpecChange(idx, spec.key, e.target.value)}
                placeholder="Value"
                className="input input-bordered w-2/3"
                required={idx === 0}
              />
              <button type="button" className="btn btn-error btn-sm" onClick={() => removeSpecField(idx)} disabled={form.specifications.length === 1}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-primary btn-sm mt-1" onClick={addSpecField}>Add Specification</button>
        </div>
        {/* Rating */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating Average</label>
            <input type="number" name="rating.average" value={form.rating.average} onChange={handleChange} className="input input-bordered w-full" min="0" max="5" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating Count</label>
            <input type="number" name="rating.count" value={form.rating.count} onChange={handleChange} className="input input-bordered w-full" min="0" />
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary px-8" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
