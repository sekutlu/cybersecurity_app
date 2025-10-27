'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Youtube, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLessonsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    youtubeId: '',
    duration: '',
    tutor: '',
    category: '',
    difficulty: 'beginner',
    icon: 'shield',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons');
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          content: '',
          youtubeId: '',
          duration: '',
          tutor: '',
          category: '',
          difficulty: 'beginner',
          icon: 'shield',
        });
        fetchLessons();
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/dashboard')}
          className="mb-6 text-slate-400 hover:text-green-400 hover:bg-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Manage Lessons</h1>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Lesson</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white">Category</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., Phishing, Malware, Passwords"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label className="text-white flex items-center">
                    <Youtube className="h-4 w-4 mr-2" />
                    YouTube URL or Video ID
                  </Label>
                  <Input
                    value={formData.youtubeId}
                    onChange={(e) => setFormData({ ...formData, youtubeId: extractYouTubeId(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://youtube.com/watch?v=... or video ID"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., 15"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Tutor/Instructor</Label>
                    <Input
                      value={formData.tutor}
                      onChange={(e) => setFormData({ ...formData, tutor: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., Dr. John Smith"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white min-h-32"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Icon</Label>
                    <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="shield">Shield</SelectItem>
                        <SelectItem value="lock">Lock</SelectItem>
                        <SelectItem value="alert-triangle">Alert</SelectItem>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="globe">Globe</SelectItem>
                        <SelectItem value="smartphone">Smartphone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold">
                    Create Lesson
                  </Button>
                  <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="border-slate-600 text-white">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson: any) => (
            <Card key={lesson._id} className="bg-slate-800 border-slate-700 hover:border-green-400/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-white text-lg">{lesson.title}</CardTitle>
                <p className="text-slate-400 text-sm">{lesson.category} • {lesson.difficulty}</p>
                {lesson.tutor && (
                  <p className="text-green-400 text-sm">By {lesson.tutor}</p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">{lesson.description}</p>
                <div className="space-y-2 mb-4">
                  {lesson.youtubeId && (
                    <div className="flex items-center text-green-400 text-sm">
                      <Youtube className="h-4 w-4 mr-2" />
                      Video included
                    </div>
                  )}
                  {lesson.duration > 0 && (
                    <div className="flex items-center text-slate-400 text-sm">
                      <span className="mr-2">⏱️</span>
                      {lesson.duration} minutes
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}