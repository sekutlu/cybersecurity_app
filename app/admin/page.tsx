'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Users, Settings, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const userRole = localStorage.getItem('userRole');
    if (!loading && isAuthenticated && userRole !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-xl text-slate-400 mb-8">
            Manage lessons, quizzes, and monitor platform activity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-slate-800 border-slate-700 shadow-lg hover:border-green-400/50 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-green-400" />
                    <CardTitle className="text-white">Manage Lessons</CardTitle>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Create, edit, and organize cybersecurity lessons with video content.
                </p>
                <Link href="/admin/lessons">
                  <Button className="w-full bg-green-400 hover:bg-green-500 text-slate-900 font-semibold">
                    Manage Lessons
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-slate-800 border-slate-700 shadow-lg hover:border-green-400/50 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-6 w-6 text-green-400" />
                    <CardTitle className="text-white">Manage Quizzes</CardTitle>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Create and manage quiz questions with detailed explanations.
                </p>
                <Link href="/admin/quizzes">
                  <Button className="w-full bg-green-400 hover:bg-green-500 text-slate-900 font-semibold">
                    Manage Quizzes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-slate-800 border-slate-700 shadow-lg hover:border-green-400/50 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-green-400" />
                    <CardTitle className="text-white">User Management</CardTitle>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Monitor user progress and manage platform users.
                </p>
                <Link href="/admin/users">
                  <Button className="w-full bg-green-400 hover:bg-green-500 text-slate-900 font-semibold">
                    Manage Users
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}