'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Users, Settings, ArrowRight, BarChart3, FileText, Shield, LogOut, User, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth();
  
  const navLinks = [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: BarChart3 },
    { href: '/lessons', label: 'Lessons', icon: BookOpen },
    { href: '/quiz', label: 'Quiz', icon: Brain },
    { href: '/admin/lessons', label: 'Manage Lessons', icon: FileText },
    { href: '/admin/quizzes', label: 'Manage Quizzes', icon: Settings },
    { href: '/admin/users', label: 'Manage Users', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
  ];
  
  const handleLogout = () => {
    logout();
    localStorage.removeItem('userRole');
    router.push('/');
  };
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalQuizzes: 0,
    totalUsers: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const userRole = localStorage.getItem('userRole');
    if (!authLoading && isAuthenticated && userRole !== 'admin') {
      router.push('/user/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchStats = async () => {
      try {
        const [lessonsRes, quizzesRes, usersRes] = await Promise.all([
          fetch('/api/lessons'),
          fetch('/api/quizzes'),
          fetch('/api/admin/users')
        ]);

        const lessons = await lessonsRes.json();
        const quizzes = await quizzesRes.json();
        const users = usersRes.ok ? await usersRes.json() : [];
        
        // Calculate active users (users active in last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const activeUsers = users.filter(user => 
          new Date(user.lastActive) > oneWeekAgo
        ).length;

        setStats({
          totalLessons: lessons.length || 0,
          totalQuizzes: quizzes.length || 0,
          totalUsers: users.length || 0,
          activeUsers: activeUsers
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, authLoading]);

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
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <span className="font-bold text-xl text-white">CyberSecure</span>
              <Crown className="h-5 w-5 text-yellow-400" />
            </Link>

            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center space-x-1 text-xs font-medium transition-colors hover:text-green-400 px-2 py-1 rounded',
                      pathname === link.href
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-slate-300'
                    )}
                  >
                    <link.icon className="h-3 w-3" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">{user?.name || user?.email}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-green-400 hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Lessons</CardTitle>
                <BookOpen className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalLessons}</div>
                <p className="text-xs text-slate-500">Active content modules</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Quizzes</CardTitle>
                <Brain className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalQuizzes}</div>
                <p className="text-xs text-slate-500">Assessment modules</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
                <Users className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                <p className="text-xs text-slate-500">Registered learners</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Active Users</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
                <p className="text-xs text-slate-500">This week</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Content Management</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">System Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium text-white">New user registered</p>
                      <p className="text-sm text-slate-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Quiz completed</p>
                      <p className="text-sm text-slate-400">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Lesson accessed</p>
                      <p className="text-sm text-slate-400">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-white">Platform Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">System Status</span>
                    <span className="text-green-400 font-semibold">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Database</span>
                    <span className="text-green-400 font-semibold">Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Last Backup</span>
                    <span className="text-slate-300">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Uptime</span>
                    <span className="text-slate-300">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}