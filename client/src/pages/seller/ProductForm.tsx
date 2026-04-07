// ============================================================================
// SELLER - ADD/EDIT PRODUCT PAGE
// ============================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { productsApi, type Category } from '../../apis/productsApi';

export const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    tags: [] as string[],
    images: [] as Array<{ url: string; publicId: string; isUploading: boolean }>
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const data: any = await productsApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const maxImages = 5 - formData.images.length;
    if (newFiles.length > maxImages) {
      toast.error(`You can only upload ${maxImages} more images`);
      return;
    }

    const placeholders = newFiles.map(() => ({
      url: '',
      publicId: '',
      isUploading: true
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...placeholders]
    }));

    setIsUploading(true);
    try {
      const response = await productsApi.uploadImages(newFiles);
      const { imageUrls } = response;

      setFormData(prev => {
        const updatedImages = [...prev.images];
        let placeholderIndex = 0;
        for (let i = 0; i < updatedImages.length; i++) {
          if (updatedImages[i].isUploading && imageUrls[placeholderIndex]) {
            const fullUrl = imageUrls[placeholderIndex];
            const publicId = `products/${fullUrl.split('/').pop()!.split('.')[0]}`;
            updatedImages[i] = {
              url: fullUrl,
              publicId,
              isUploading: false
            };
            placeholderIndex++;
          }
        }
        return { ...prev, images: updatedImages };
      });

      toast.success(`${imageUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to upload images');
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => !img.isUploading)
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (index: number) => {
    const image = formData.images[index];
    
    if (image.isUploading) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      return;
    }

    try {
      await productsApi.deleteImage(image.publicId);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    if (isUploading) {
      toast.error('Please wait for images to finish uploading');
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice || undefined,
        categoryId: formData.category,
        images: formData.images.filter(img => !img.isUploading).map(img => img.url),
        stock: parseInt(formData.stock, 10),
        tags: formData.tags,
        isFeatured: false,
      };

      await productsApi.createProduct(productData);
      toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully');
      navigate('/seller/listings');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasCompletedImages = formData.images.some(img => !img.isUploading);
  const isSubmitDisabled = isSubmitting || isUploading || !hasCompletedImages;

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/seller/listings"
            className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-warm-gray" />
          </Link>
          <div>
            <h1 className="text-3xl font-display text-warm-white">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-warm-gray font-body mt-1">
              {isEdit ? 'Update your product details' : 'Create a new product listing'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Section */}
          <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
            <h2 className="text-xl font-display text-warm-white mb-6">Product Images</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {formData.images.map((image, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                  {image.isUploading ? (
                    <div className="w-full h-full bg-dark-base flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                  )}
                  {!image.isUploading && (
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              
              {formData.images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="aspect-square rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:border-gold hover:bg-gold/5 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <span className="text-warm-gray text-sm font-body">Uploading...</span>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-warm-gray" />
                      <span className="text-warm-gray text-sm font-body">Upload</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <p className="text-warm-gray text-sm font-body">
              Upload up to 5 images. First image will be the main product image.
            </p>
          </div>

          {/* Basic Info */}
          <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
            <h2 className="text-xl font-display text-warm-white mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-warm-gray text-sm font-body mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                />
              </div>

              <div>
                <label className="block text-warm-gray text-sm font-body mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  <label className="block text-warm-gray text-sm font-body mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
            <h2 className="text-xl font-display text-warm-white mb-6">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-warm-gray text-sm font-body mb-2">Price *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray">$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block text-warm-gray text-sm font-body mb-2">Original Price (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                  />
                </div>
                <p className="text-warm-gray text-xs font-body mt-2">Leave empty if not on sale</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
            <h2 className="text-xl font-display text-warm-white mb-6">Tags</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
                className="flex-1 px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 bg-gold text-dark-base rounded-lg font-body font-medium hover:bg-gold-light transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark-base text-warm-white rounded-full text-sm font-body"
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              to="/seller/listings"
              className="px-8 py-3 border border-white/20 text-warm-white rounded-lg font-body hover:bg-white/5 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="px-8 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};