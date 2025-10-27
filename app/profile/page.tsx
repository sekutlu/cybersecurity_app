'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, User, Mail, Calendar, ArrowLeft, Edit, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    createdAt: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    
    // Load profile from localStorage for now
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    setProfile({
      name: userName || '',
      email: userEmail || '',
      bio: 'Cybersecurity learner',
      createdAt: new Date().toISOString(),
    });
    setLoading(false);
  }, [isAuthenticated, authLoading]);

  const handleSave = () => {
    localStorage.setItem('userName', profile.name);
    setIsEditing(false);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <span className="font-bold text-xl text-white">CyberSecure</span>
            </Link>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-slate-400 hover:text-green-400 hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-green-400/10 rounded-full border border-green-400/20">
                    <User className="h-12 w-12 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-white">Profile</CardTitle>
                    <p className="text-slate-400 mt-1">Manage your account information</p>
                  </div>
                </div>
                <Button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold"
                >
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  ) : (
                    <div className="p-3 bg-slate-700 rounded-md text-white mt-2">
                      {profile.name || 'Not set'}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label className="text-white">Email Address</Label>
                  <div className="p-3 bg-slate-700 rounded-md text-slate-400 mt-2 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {profile.email}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-white">Bio</Label>
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="p-3 bg-slate-700 rounded-md text-white mt-2">
                    {profile.bio || 'No bio added yet'}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-700">
                <div className="flex items-center text-slate-400 text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}