'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, ArrowRight, Award, TrendingUp, Lightbulb, Shield, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ProgressCard from '@/components/ProgressCard';

export default function UserDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth();
  
  const navLinks = [
    { href: '/user/dashboard', label: 'Dashboard', icon: TrendingUp },
    { href: '/lessons', label: 'Lessons', icon: BookOpen },
    { href: '/quiz', label: 'Quiz', icon: Brain },
    { href: '/profile', label: 'Profile', icon: User },
  ];
  
  const handleLogout = () => {
    logout();
    localStorage.removeItem('userRole');
    router.push('/');
  };
  
  const [dailyTip, setDailyTip] = useState('');
  const [localProgress, setLocalProgress] = useState([]);
  const [lessonProgress, setLessonProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      router.push('/admin/dashboard');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchData = async () => {
      try {
        const tipRes = await fetch('/api/tips');
        const tipData = await tipRes.json();
        setDailyTip(tipData.tip);

        const userId = localStorage.getItem('userId');
        
        const storedProgress = localStorage.getItem('quizProgress');
        if (storedProgress) {
          try {
            const allProgress = JSON.parse(storedProgress);
            const userProgress = allProgress.filter((p) => p.userId === userId);
            setLocalProgress(userProgress);
          } catch (e) {
            localStorage.removeItem('quizProgress');
            setLocalProgress([]);
          }
        } else {
          setLocalProgress([]);
        }
        
        const storedLessonProgress = localStorage.getItem('lessonProgress');
        if (storedLessonProgress) {
          try {
            const allLessonProgress = JSON.parse(storedLessonProgress);
            const userLessonProgress = allLessonProgress.filter((p) => p.userId === userId);
            setLessonProgress(userLessonProgress);
          } catch (e) {
            localStorage.removeItem('lessonProgress');
            setLessonProgress([]);
          }
        } else {
          setLessonProgress([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, authLoading]);

  const calculateStats = () => {
    const quizStats = localProgress.length > 0 ? {
      quizzesTaken: localProgress.length,
      averageScore: Math.round(localProgress.reduce((sum, quiz) => sum + quiz.score, 0) / localProgress.length)
    } : {
      quizzesTaken: 0,
      averageScore: 0,
    };
    
    const completedLessons = lessonProgress.filter(p => p.status === 'completed').length;
    const startedLessons = lessonProgress.filter(p => p.status === 'started').length;
    const enrolledLessons = lessonProgress.filter(p => p.status === 'enrolled').length;
    
    return {
      ...quizStats,
      completedLessons,
      startedLessons,
      enrolledLessons,
      totalLessonsInProgress: startedLessons + completedLessons + enrolledLessons
    };
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

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/user/dashboard" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <span className="font-bold text-xl text-white">CyberSecure</span>
            </Link>

            <div className="flex items-center space-x-6">
              <div className="flex space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-green-400',
                      pathname === link.href
                        ? 'text-green-400 border-b-2 border-green-400'
                        : 'text-slate-300'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-300">
                  <User className="h-4 w-4" />
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
          <h1 className="text-4xl font-bold text-white mb-4">Learning Dashboard</h1>
          <p className="text-xl text-slate-400 mb-8">
            Track your cybersecurity learning progress
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-green-400 to-green-500 text-slate-900 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-6 w-6" />
                <CardTitle className="text-slate-900">Cyber Tip of the Day</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{dailyTip}</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ProgressCard
            title="Quizzes Taken"
            value={stats.quizzesTaken}
            icon="trophy"
            index={0}
          />
          <ProgressCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            icon="target"
            index={1}
          />
          <ProgressCard
            title="Lessons Enrolled"
            value={stats.totalLessonsInProgress}
            icon="award"
            index={2}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700 shadow-lg hover:border-green-400/50 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-green-400" />
                    <CardTitle className="text-white">Lessons</CardTitle>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Learn cybersecurity fundamentals through interactive lessons with video content.
                </p>
                <Link href="/lessons">
                  <Button className="w-full bg-green-400 hover:bg-green-500 text-slate-900 font-semibold">
                    Browse Lessons
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 shadow-lg hover:border-green-400/50 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-6 w-6 text-green-400" />
                    <CardTitle className="text-white">Quizzes</CardTitle>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Test your knowledge and earn badges by taking cybersecurity quizzes.
                </p>
                <Link href="/quiz">
                  <Button className="w-full bg-green-400 hover:bg-green-500 text-slate-900 font-semibold">
                    Take Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-white">Your Badges</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {localProgress.filter(p => p.passed).length > 0 ? (
                    localProgress.filter(p => p.passed).map((quiz, index) => (
                      <Badge key={index} className="bg-green-400 text-slate-900 px-3 py-1 font-semibold">
                        Quiz Master
                      </Badge>
                    ))
                  ) : (
                    <p className="text-slate-400">No badges earned yet. Pass quizzes with 80%+ to earn badges!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {localProgress.length > 0 ? (
                  <div className="space-y-3">
                    {localProgress.slice(-5).reverse().map((quiz, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg border border-slate-600">
                        <div>
                          <p className="font-medium text-white">Quiz Completed</p>
                          <p className="text-sm text-slate-400">
                            {new Date(quiz.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={quiz.score >= 80 ? 'bg-green-400 text-slate-900' : 'bg-red-500 text-white'}>
                          {quiz.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No activity yet. Start taking quizzes to see your progress!</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}