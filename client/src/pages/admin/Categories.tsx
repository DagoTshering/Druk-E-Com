// ============================================================================
// ADMIN - CATEGORIES PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { categories as initialCategories } from '../../dataStore';
import { TableRowSkeleton } from '../../components/Skeleton';
import { toast } from 'sonner';

export const AdminCategories: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryList, setCategoryList] = useState(initialCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof initialCategories[0] | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredCategories = categoryList.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (editingCategory) {
      setCategoryList(prev => prev.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, name: formData.name, description: formData.description }
          : cat
      ));
      toast.success('Category updated');
    } else {
      const newCategory = {
        id: `cat${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        productCount: 0
      };
      setCategoryList(prev => [...prev, newCategory]);
      toast.success('Category created');
    }

    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleDelete = (categoryId: string) => {
    setCategoryList(prev => prev.filter(cat => cat.id !== categoryId));
    toast.success('Category deleted');
  };

  const handleEdit = (category: typeof initialCategories[0]) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display text-warm-white">Categories</h1>
            <p className="text-warm-gray font-body mt-1">Manage product categories</p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', description: '' });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-gold text-dark-base px-6 py-3 rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
          />
        </div>

        {/* Categories List */}
        <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden">
          {isLoading ? (
            <table className="w-full">
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))}
              </tbody>
            </table>
          ) : filteredCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm w-10"></th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Category</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Description</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Products</th>
                    <th className="text-right py-4 px-6 text-warm-gray font-body text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category, idx) => (
                    <tr
                      key={category.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors animate-slide-up"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className="py-4 px-2">
                        <button className="p-1 hover:bg-white/5 rounded cursor-grab">
                          <GripVertical className="w-4 h-4 text-warm-gray" />
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="text-warm-white font-body font-medium">{category.name}</p>
                            <p className="text-warm-gray text-sm font-body">/{category.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-warm-gray font-body">{category.description}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-body">
                          {category.productCount} products
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-warm-gray" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-base flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-warm-gray" />
              </div>
              <h3 className="text-warm-white font-display mb-2">No categories found</h3>
              <p className="text-warm-gray font-body">Create your first category to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-dark-surface rounded-xl border border-white/10 p-6 w-full max-w-md animate-scale-in">
            <h2 className="text-xl font-display text-warm-white mb-6">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-warm-gray text-sm font-body mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Category name"
                  className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                />
              </div>
              <div>
                <label className="block text-warm-gray text-sm font-body mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-white/20 text-warm-white rounded-lg font-body hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
