// ============================================================================
// CUSTOMER - PROFILE PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Camera, Save, User, MapPin } from 'lucide-react';
import { users, type User as UserType } from '../../dataStore';
import { Skeleton } from '../../components/Skeleton';
import { toast } from 'sonner';

interface ProfileProps {
  currentUserId: string;
}

export const Profile: React.FC<ProfileProps> = ({ currentUserId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = users.find(u => u.id === currentUserId);
      if (found) {
        setUser(found);
        setFormData({
          name: found.name,
          email: found.email,
          phone: found.phone || '',
          street: found.address?.street || '',
          city: found.address?.city || '',
          state: found.address?.state || '',
          zip: found.address?.zip || '',
          country: found.address?.country || ''
        });
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentUserId]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-display text-warm-white mb-8">My Profile</h1>
          <div className="bg-dark-surface rounded-xl p-8 space-y-6">
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <p className="text-warm-gray font-body">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display text-warm-white">My Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gold text-dark-base rounded-lg font-body font-medium hover:bg-gold-light transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden animate-fade-in">
          {/* Avatar Section */}
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gold"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-gold text-dark-base rounded-full flex items-center justify-center hover:bg-gold-light transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-xl font-display text-warm-white">{user.name}</h2>
                <p className="text-warm-gray font-body capitalize">{user.role}</p>
                <p className="text-warm-gray text-sm font-body mt-1">
                  Member since {new Date(user.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-warm-white font-display mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gold" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                    />
                  ) : (
                    <p className="text-warm-white font-body py-3">{user.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                    />
                  ) : (
                    <p className="text-warm-white font-body py-3">{user.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                    />
                  ) : (
                    <p className="text-warm-white font-body py-3">{user.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-warm-white font-display mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                Shipping Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">Street Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                    />
                  ) : (
                    <p className="text-warm-white font-body py-3">{user.address?.street || 'Not provided'}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-warm-gray text-sm font-body mb-2">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                      />
                    ) : (
                      <p className="text-warm-white font-body py-3">{user.address?.city || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-warm-gray text-sm font-body mb-2">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                      />
                    ) : (
                      <p className="text-warm-white font-body py-3">{user.address?.state || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-warm-gray text-sm font-body mb-2">ZIP</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                      />
                    ) : (
                      <p className="text-warm-white font-body py-3">{user.address?.zip || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-warm-gray text-sm font-body mb-2">Country</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                      />
                    ) : (
                      <p className="text-warm-white font-body py-3">{user.address?.country || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {isEditing && (
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-white/20 text-warm-white rounded-lg font-body hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
