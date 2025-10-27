'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LessonCard from '@/components/LessonCard';
import { Settings, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, User, Crown, TrendingUp, Brain, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: string;
  duration?: number;
  tutor?: string;
}

interface LessonProgress {
  lessonId: string;
  status: 'not-started' | 'enrolled' | 'started' | 'completed';
  enrolledAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export default function LessonsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth();
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  
  const userNavLinks = [
    { href: '/user/dashboard', label: 'Dashboard', icon: TrendingUp },
    { href: '/lessons', label: 'Lessons', icon: BookOpen },
    { href: '/quiz', label: 'Quiz', icon: Brain },
    { href: '/profile', label: 'Profile', icon: User },
  ];
  
  const adminNavLinks = [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: TrendingUp },
    { href: '/lessons', label: 'Lessons', icon: BookOpen },
    { href: '/quiz', label: 'Quiz', icon: Brain },
    { href: '/admin/lessons', label: 'Manage Lessons', icon: Settings },
    { href: '/admin/quizzes', label: 'Manage Quizzes', icon: Settings },
    { href: '/admin/users', label: 'Manage Users', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
  ];
  
  const navLinks = userRole === 'admin' ? adminNavLinks : userNavLinks;
  
  const handleLogout = () => {
    logout();
    localStorage.removeItem('userRole');
    router.push('/');
  };
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchLessons = async () => {
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          fetch('/api/lessons'),
          fetch('/api/user/lesson-progress')
        ]);
        
        const lessonsData = await lessonsRes.json();
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
        
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData);
        } else {
          const userId = localStorage.getItem('userId');
          const stored = localStorage.getItem('lessonProgress');
          if (stored) {
            const allProgress = JSON.parse(stored);
            const userProgress = allProgress.filter((p: any) => p.userId === userId);
            setProgress(userProgress);
          }
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [isAuthenticated, authLoading]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <span className="font-bold text-xl text-white">CyberSecure</span>
              {userRole === 'admin' && <Crown className="h-5 w-5 text-yellow-400" />}
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
                  {userRole === 'admin' ? <Crown className="h-4 w-4 text-yellow-400" /> : <User className="h-4 w-4" />}
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
          <h1 className="text-4xl font-bold text-white mb-4">Cybersecurity Lessons</h1>
          <p className="text-xl text-slate-400 mb-12">
            Explore essential cybersecurity topics and build your knowledge base
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-6 shadow-md animate-pulse border border-slate-700">
                <div className="h-12 w-12 bg-green-400/20 rounded-lg mb-4"></div>
                <div className="h-6 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(lessons) && lessons.map((lesson: Lesson, index: number) => {
              const userId = localStorage.getItem('userId');
              const lessonProgress = progress.find((p: any) => p.lessonId === lesson._id && p.userId === userId);
              return (
                <LessonCard
                  key={lesson._id}
                  id={lesson._id}
                  title={lesson.title}
                  description={lesson.description}
                  icon={lesson.icon}
                  index={index}
                  duration={lesson.duration}
                  tutor={lesson.tutor}
                  progress={lessonProgress?.status || 'not-started'}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}