import React from 'react';
import { Plus, X } from 'lucide-react';
import type { Category } from '@/apis/productsApi';
import type { ProductFormState } from '../utils/types';

interface ProductInfoStepProps {
  state: ProductFormState;
  categories: Category[];
  isLoadingCategories: boolean;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setCategoryId: (categoryId: string) => void;
  setBrand: (brand: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

export function ProductInfoStep({
  state,
  categories,
  isLoadingCategories,
  setName,
  setDescription,
  setCategoryId,
  setBrand,
  addTag,
  removeTag,
}: ProductInfoStepProps) {
  const [tagInput, setTagInput] = React.useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !state.tags.includes(tagInput.trim())) {
      addTag(tagInput.trim());
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <label className="block text-warm-gray text-sm font-body mb-2">
          Product Name *
        </label>
        <input
          type="text"
          value={state.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-warm-gray text-sm font-body mb-2">
          Description *
        </label>
        <textarea
          rows={4}
          value={state.description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your product..."
          className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body resize-none"
        />
      </div>

      {/* Category & Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-warm-gray text-sm font-body mb-2">
            Category *
          </label>
          <select
            value={state.categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isLoadingCategories}
            className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body appearance-none"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-warm-gray text-sm font-body mb-2">
            Brand (Optional)
          </label>
          <input
            type="text"
            value={state.brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter brand name"
            className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-warm-gray text-sm font-body mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag"
            className="flex-1 px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-3 bg-gold text-dark-base rounded-lg hover:bg-gold-light transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {state.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark-surface text-warm-white rounded-full text-sm font-body"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-warm-gray hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
